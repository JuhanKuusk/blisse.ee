#!/usr/bin/env node
/**
 * Sync physical products from Blisse WooCommerce to Supabase
 * Only syncs non-virtual products (physical goods for e-shop)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// WooCommerce configuration (using backend.kehastuudio.ee as source since blisse.ee has bot protection)
const WC_URL = process.env.SOURCE_WC_URL || 'https://backend.kehastuudio.ee';
const WC_CONSUMER_KEY = process.env.SOURCE_WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.SOURCE_WC_CONSUMER_SECRET;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Fetch all products from WooCommerce
 */
async function fetchWooCommerceProducts(page = 1, perPage = 100) {
  const url = `${WC_URL}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}&status=publish&consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`);
    }
    const products = await response.json();
    const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
    return { products, totalPages };
  } catch (error) {
    console.error('Error fetching from WooCommerce:', error);
    throw error;
  }
}

/**
 * Fetch all products (paginated)
 */
async function fetchAllProducts() {
  const allProducts = [];
  let page = 1;
  let totalPages = 1;

  do {
    console.log(`Fetching page ${page}...`);
    const result = await fetchWooCommerceProducts(page);
    allProducts.push(...result.products);
    totalPages = result.totalPages;
    page++;
  } while (page <= totalPages);

  return allProducts;
}

/**
 * Filter for physical products only (non-virtual)
 */
function filterPhysicalProducts(products) {
  return products.filter(product => {
    // Exclude virtual products (treatments, packages)
    if (product.virtual === true) return false;

    // Exclude products in treatment categories
    const treatmentCategories = ['salongihooldused', 'hoolduspaketid', 'hooldused'];
    const categories = product.categories?.map(c => c.slug.toLowerCase()) || [];
    const hasTreatmentCategory = categories.some(cat =>
      treatmentCategories.some(tc => cat.includes(tc))
    );
    if (hasTreatmentCategory) return false;

    return true;
  });
}

/**
 * Transform WooCommerce product to Supabase format
 */
function transformProduct(wcProduct) {
  return {
    wc_id: wcProduct.id,
    name: wcProduct.name,
    slug: wcProduct.slug,
    description: wcProduct.description || null,
    short_description: wcProduct.short_description || null,
    price: parseFloat(wcProduct.price) || null,
    regular_price: parseFloat(wcProduct.regular_price) || null,
    sale_price: wcProduct.sale_price ? parseFloat(wcProduct.sale_price) : null,
    image_url: wcProduct.images?.[0]?.src || null,
    categories: wcProduct.categories?.map(c => c.name) || [],
    sku: wcProduct.sku || null,
    stock_quantity: wcProduct.stock_quantity || null,
    stock_status: wcProduct.stock_status || 'instock',
    status: wcProduct.status || 'publish',
    type: wcProduct.type || 'simple',
    virtual: wcProduct.virtual || false,
  };
}

/**
 * Upsert products to Supabase (in batches to avoid issues)
 */
async function upsertProducts(products) {
  const transformedProducts = products.map(transformProduct);

  console.log(`Upserting ${transformedProducts.length} products to Supabase...`);

  // Upsert in batches of 10 to identify problematic products
  const batchSize = 10;
  let successCount = 0;

  for (let i = 0; i < transformedProducts.length; i += batchSize) {
    const batch = transformedProducts.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('blisse_products')
      .upsert(batch, {
        onConflict: 'wc_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error(`Error upserting batch ${Math.floor(i / batchSize) + 1}:`);
      console.error('  Message:', error.message);
      console.error('  Details:', error.details);
      console.error('  Hint:', error.hint);
      console.error('  Code:', error.code);
      console.error('Problematic products:', batch.map(p => `${p.name} (wc_id: ${p.wc_id})`).join(', '));
      // Continue with next batch instead of throwing
    } else {
      successCount += batch.length;
      console.log(`  Batch ${Math.floor(i / batchSize) + 1} complete`);
    }
  }

  console.log(`Successfully upserted ${successCount} of ${transformedProducts.length} products`);
  return null;
}

/**
 * Remove products that no longer exist in WooCommerce
 */
async function cleanupDeletedProducts(currentWcIds) {
  const { data: existingProducts, error: fetchError } = await supabase
    .from('blisse_products')
    .select('wc_id');

  if (fetchError) {
    console.error('Error fetching existing products:', fetchError);
    return;
  }

  const existingWcIds = existingProducts.map(p => p.wc_id);
  const deletedWcIds = existingWcIds.filter(id => !currentWcIds.includes(id));

  if (deletedWcIds.length > 0) {
    console.log(`Removing ${deletedWcIds.length} deleted products...`);
    const { error: deleteError } = await supabase
      .from('blisse_products')
      .delete()
      .in('wc_id', deletedWcIds);

    if (deleteError) {
      console.error('Error deleting products:', deleteError);
    }
  }
}

/**
 * Main sync function
 */
async function syncProducts() {
  console.log('=== Blisse E-pood Product Sync ===\n');
  console.log(`Source: ${WC_URL}`);
  console.log(`Target: Supabase (blisse_products table)\n`);

  try {
    // Fetch all products from WooCommerce
    console.log('Fetching products from WooCommerce...');
    const allProducts = await fetchAllProducts();
    console.log(`Total products fetched: ${allProducts.length}`);

    // Filter for physical products only
    const physicalProducts = filterPhysicalProducts(allProducts);
    console.log(`Physical products (for e-shop): ${physicalProducts.length}`);
    console.log(`Virtual products (treatments): ${allProducts.length - physicalProducts.length}`);

    if (physicalProducts.length === 0) {
      console.log('\nNo physical products to sync.');
      return;
    }

    // List products
    console.log('\nProducts to sync:');
    physicalProducts.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (${p.price}€) - ${p.categories?.map(c => c.name).join(', ') || 'Uncategorized'}`);
    });

    // Upsert to Supabase
    await upsertProducts(physicalProducts);

    // Cleanup deleted products
    const currentWcIds = physicalProducts.map(p => p.id);
    await cleanupDeletedProducts(currentWcIds);

    console.log('\n=== Sync Complete ===');

  } catch (error) {
    console.error('\nSync failed:', error);
    process.exit(1);
  }
}

// Run sync
syncProducts();
