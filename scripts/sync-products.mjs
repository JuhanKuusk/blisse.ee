#!/usr/bin/env node
/**
 * WooCommerce Product Sync Script
 *
 * Reads products from backend.kehastuudio.ee and creates them in blisse.ee WordPress
 *
 * Usage:
 *   node scripts/sync-products.mjs
 *
 * Before running:
 *   1. Copy .env.example to .env
 *   2. Fill in your WooCommerce API credentials
 *   3. Run: npm install node-fetch
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found! Copy .env.example to .env and fill in your credentials.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      process.env[key.trim()] = value;
    }
  }
}

loadEnv();

// Configuration
const SOURCE_CONFIG = {
  url: process.env.SOURCE_WC_URL || 'https://backend.kehastuudio.ee',
  consumerKey: process.env.SOURCE_WC_CONSUMER_KEY,
  consumerSecret: process.env.SOURCE_WC_CONSUMER_SECRET
};

const TARGET_CONFIG = {
  url: process.env.TARGET_WC_URL || 'https://blisse.ee',
  consumerKey: process.env.TARGET_WC_CONSUMER_KEY,
  consumerSecret: process.env.TARGET_WC_CONSUMER_SECRET
};

// Validate configuration
function validateConfig() {
  const missing = [];

  if (!SOURCE_CONFIG.consumerKey) missing.push('SOURCE_WC_CONSUMER_KEY');
  if (!SOURCE_CONFIG.consumerSecret) missing.push('SOURCE_WC_CONSUMER_SECRET');
  if (!TARGET_CONFIG.consumerKey) missing.push('TARGET_WC_CONSUMER_KEY');
  if (!TARGET_CONFIG.consumerSecret) missing.push('TARGET_WC_CONSUMER_SECRET');

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.error('Please fill in all required credentials in .env file');
    process.exit(1);
  }
}

// Create Basic Auth header
function getAuthHeader(config) {
  const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
  return `Basic ${credentials}`;
}

// Fetch all products from source WooCommerce
async function fetchSourceProducts() {
  console.log(`\n📥 Fetching products from ${SOURCE_CONFIG.url}...`);

  const allProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${SOURCE_CONFIG.url}/wp-json/wc/v3/products?per_page=100&page=${page}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': getAuthHeader(SOURCE_CONFIG),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const products = await response.json();

      if (products.length === 0) {
        hasMore = false;
      } else {
        allProducts.push(...products);
        console.log(`   Page ${page}: ${products.length} products`);
        page++;
      }
    } catch (error) {
      console.error(`❌ Error fetching products:`, error.message);
      throw error;
    }
  }

  console.log(`✅ Total products fetched: ${allProducts.length}`);
  return allProducts;
}

// Fetch all categories from source WooCommerce
async function fetchSourceCategories() {
  console.log(`\n📥 Fetching categories from ${SOURCE_CONFIG.url}...`);

  const allCategories = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${SOURCE_CONFIG.url}/wp-json/wc/v3/products/categories?per_page=100&page=${page}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': getAuthHeader(SOURCE_CONFIG),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const categories = await response.json();

      if (categories.length === 0) {
        hasMore = false;
      } else {
        allCategories.push(...categories);
        page++;
      }
    } catch (error) {
      console.error(`❌ Error fetching categories:`, error.message);
      throw error;
    }
  }

  console.log(`✅ Total categories fetched: ${allCategories.length}`);
  return allCategories;
}

// Create a category in target WooCommerce
async function createCategory(category, parentId = 0) {
  const categoryData = {
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    parent: parentId
  };

  // Add image if exists
  if (category.image && category.image.src) {
    categoryData.image = {
      src: category.image.src,
      alt: category.image.alt || category.name
    };
  }

  const url = `${TARGET_CONFIG.url}/wp-json/wc/v3/products/categories`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(TARGET_CONFIG),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoryData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Check if category already exists
      if (errorText.includes('term_exists')) {
        console.log(`   ⏭️  Category "${category.name}" already exists, skipping...`);
        // Try to get existing category
        return await findExistingCategory(category.slug);
      }
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const newCategory = await response.json();
    console.log(`   ✅ Created category: ${newCategory.name} (ID: ${newCategory.id})`);
    return newCategory;
  } catch (error) {
    console.error(`   ❌ Error creating category "${category.name}":`, error.message);
    return null;
  }
}

// Find existing category by slug
async function findExistingCategory(slug) {
  const url = `${TARGET_CONFIG.url}/wp-json/wc/v3/products/categories?slug=${slug}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(TARGET_CONFIG),
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const categories = await response.json();
      if (categories.length > 0) {
        return categories[0];
      }
    }
  } catch (error) {
    // Ignore errors
  }

  return null;
}

// Sync categories and return mapping of old ID to new ID
async function syncCategories(sourceCategories) {
  console.log(`\n📂 Syncing ${sourceCategories.length} categories to ${TARGET_CONFIG.url}...`);

  const categoryMapping = {};

  // Sort categories by parent (root categories first)
  const sortedCategories = [...sourceCategories].sort((a, b) => a.parent - b.parent);

  for (const category of sortedCategories) {
    // Find new parent ID if category has parent
    let newParentId = 0;
    if (category.parent && category.parent !== 0) {
      newParentId = categoryMapping[category.parent] || 0;
    }

    const newCategory = await createCategory(category, newParentId);
    if (newCategory) {
      categoryMapping[category.id] = newCategory.id;
    }
  }

  console.log(`✅ Category sync complete. Mapped ${Object.keys(categoryMapping).length} categories.`);
  return categoryMapping;
}

// Create a product in target WooCommerce
async function createProduct(product, categoryMapping) {
  // Map category IDs to new IDs
  const newCategories = (product.categories || [])
    .map(cat => {
      const newId = categoryMapping[cat.id];
      return newId ? { id: newId } : null;
    })
    .filter(Boolean);

  // Prepare product data
  const productData = {
    name: product.name,
    slug: product.slug,
    type: product.type || 'simple',
    status: product.status || 'publish',
    featured: product.featured || false,
    description: product.description || '',
    short_description: product.short_description || '',
    sku: product.sku || '',
    regular_price: product.regular_price || '',
    sale_price: product.sale_price || '',
    virtual: product.virtual || true,  // Services are virtual
    downloadable: product.downloadable || false,
    categories: newCategories,
    tags: (product.tags || []).map(tag => ({ name: tag.name })),
    attributes: (product.attributes || []).map(attr => ({
      name: attr.name,
      options: attr.options || [],
      visible: attr.visible !== false,
      variation: attr.variation || false
    })),
    menu_order: product.menu_order || 0,
    meta_data: product.meta_data || []
  };

  // Add images
  if (product.images && product.images.length > 0) {
    productData.images = product.images.map(img => ({
      src: img.src,
      alt: img.alt || product.name
    }));
  }

  const url = `${TARGET_CONFIG.url}/wp-json/wc/v3/products`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(TARGET_CONFIG),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const newProduct = await response.json();
    console.log(`   ✅ Created: ${newProduct.name} (ID: ${newProduct.id}) - ${newProduct.regular_price}€`);
    return newProduct;
  } catch (error) {
    console.error(`   ❌ Error creating "${product.name}":`, error.message);
    return null;
  }
}

// Main sync function
async function syncProducts() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  WooCommerce Product Sync');
  console.log('  Source: backend.kehastuudio.ee → Target: blisse.ee');
  console.log('═══════════════════════════════════════════════════════════════');

  validateConfig();

  try {
    // Fetch source data
    const sourceCategories = await fetchSourceCategories();
    const sourceProducts = await fetchSourceProducts();

    // Sync categories first
    const categoryMapping = await syncCategories(sourceCategories);

    // Sync products
    console.log(`\n📦 Syncing ${sourceProducts.length} products to ${TARGET_CONFIG.url}...`);

    let successCount = 0;
    let errorCount = 0;

    for (const product of sourceProducts) {
      const result = await createProduct(product, categoryMapping);
      if (result) {
        successCount++;
      } else {
        errorCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  Sync Complete!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  ✅ Products created: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📂 Categories synced: ${Object.keys(categoryMapping).length}`);
    console.log('═══════════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run the sync
syncProducts();
