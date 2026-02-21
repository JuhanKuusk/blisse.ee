#!/usr/bin/env node
/**
 * Sync only the 6 products that failed due to WebP images
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
    console.error('Error: .env file not found!');
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
  url: process.env.SOURCE_WC_URL,
  consumerKey: process.env.SOURCE_WC_CONSUMER_KEY,
  consumerSecret: process.env.SOURCE_WC_CONSUMER_SECRET
};

const TARGET_CONFIG = {
  url: process.env.TARGET_WC_URL,
  consumerKey: process.env.TARGET_WC_CONSUMER_KEY,
  consumerSecret: process.env.TARGET_WC_CONSUMER_SECRET
};

function getAuthHeader(config) {
  const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
  return `Basic ${credentials}`;
}

// Product names that failed due to WebP
const FAILED_PRODUCTS = [
  "Lipo Kavi Krüo Lpg - Parimad kehahooldused järjest!",
  "PERRIS SWISS LABORATORY Flash Detox Mask 75ML",
  "PERRIS SWISS LABORATORY The Ultimate Cream Plus 50ML",
  "Cold Lipo Laser",
  "PERRIS SWISS LABORATORY Gentle Cleanser Urban Protection 200ML",
  "PERRIS SWISS LABORATORY Beauty Micellar Cleansing Milk"
];

// Fetch product by name from source
async function fetchProductByName(name) {
  const url = `${SOURCE_CONFIG.url}/wp-json/wc/v3/products?search=${encodeURIComponent(name)}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': getAuthHeader(SOURCE_CONFIG),
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status}`);
  }

  const products = await response.json();
  return products.find(p => p.name === name);
}

// Get existing categories from target
async function getTargetCategories() {
  const categories = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${TARGET_CONFIG.url}/wp-json/wc/v3/products/categories?per_page=100&page=${page}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(TARGET_CONFIG),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) break;

    const data = await response.json();
    if (data.length === 0) {
      hasMore = false;
    } else {
      categories.push(...data);
      page++;
    }
  }

  return categories;
}

// Create product in target
async function createProduct(product, targetCategories) {
  // Map categories by name
  const newCategories = (product.categories || [])
    .map(cat => {
      const targetCat = targetCategories.find(tc => tc.name === cat.name);
      return targetCat ? { id: targetCat.id } : null;
    })
    .filter(Boolean);

  const productData = {
    name: product.name,
    slug: product.slug + '-synced',  // Add suffix to avoid slug conflicts
    type: product.type || 'simple',
    status: product.status || 'publish',
    featured: product.featured || false,
    description: product.description || '',
    short_description: product.short_description || '',
    sku: product.sku ? product.sku + '-synced' : '',  // Avoid SKU conflicts
    regular_price: product.regular_price || '',
    sale_price: product.sale_price || '',
    virtual: product.virtual || true,
    categories: newCategories,
    menu_order: product.menu_order || 0
  };

  // Skip ALL images for now - WebP is blocked by Zone.ee server
  // Images can be added manually in WP admin later
  // productData.images = [];

  const url = `${TARGET_CONFIG.url}/wp-json/wc/v3/products`;

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

  return await response.json();
}

// Main function
async function main() {
  console.log('Syncing WebP products...\n');

  // Get target categories first
  const targetCategories = await getTargetCategories();
  console.log(`Found ${targetCategories.length} categories in target\n`);

  for (const productName of FAILED_PRODUCTS) {
    console.log(`\nProcessing: ${productName}`);

    try {
      // Fetch product from source
      const product = await fetchProductByName(productName);

      if (!product) {
        console.log(`  Product not found in source, skipping...`);
        continue;
      }

      console.log(`  Found product ID ${product.id} with ${product.images?.length || 0} images`);

      // Create in target
      const newProduct = await createProduct(product, targetCategories);
      console.log(`  Created: ID ${newProduct.id}`);

    } catch (error) {
      console.error(`  Error: ${error.message}`);
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\nDone!');
}

main();
