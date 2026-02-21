#!/usr/bin/env node
/**
 * Apply blisse_products table schema to Supabase
 * Run this once to create the table
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function applySchema() {
  console.log('Checking if blisse_products table exists...');

  // Try to select from the table
  const { error: checkError } = await supabase
    .from('blisse_products')
    .select('id')
    .limit(1);

  if (!checkError) {
    console.log('blisse_products table already exists!');
    return;
  }

  console.log('Table does not exist. Please create it manually in Supabase SQL Editor.');
  console.log('\nGo to: https://supabase.com/dashboard/project/anhhmzhjgntbnnyakkrg/sql/new');
  console.log('\nRun this SQL:\n');
  console.log(`
-- BLISSE_PRODUCTS (E-pood tooted) Table
CREATE TABLE IF NOT EXISTS blisse_products (
    id SERIAL PRIMARY KEY,
    wc_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(200),
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2),
    regular_price DECIMAL(10,2),
    sale_price DECIMAL(10,2),
    image_url VARCHAR(500),
    categories TEXT[],
    sku VARCHAR(100),
    stock_quantity INTEGER,
    stock_status VARCHAR(50) DEFAULT 'instock',
    status VARCHAR(50) DEFAULT 'publish',
    type VARCHAR(50) DEFAULT 'simple',
    virtual BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blisse_products_status ON blisse_products(status);
CREATE INDEX IF NOT EXISTS idx_blisse_products_virtual ON blisse_products(virtual);
CREATE INDEX IF NOT EXISTS idx_blisse_products_wc_id ON blisse_products(wc_id);

-- Row Level Security
ALTER TABLE blisse_products ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Allow public read access to blisse_products" ON blisse_products;
CREATE POLICY "Allow public read access to blisse_products"
    ON blisse_products FOR SELECT
    USING (status = 'publish');

-- Service role full access
DROP POLICY IF EXISTS "Allow service role full access to blisse_products" ON blisse_products;
CREATE POLICY "Allow service role full access to blisse_products"
    ON blisse_products FOR ALL
    USING (true)
    WITH CHECK (true);
`);
}

applySchema();
