-- Drop the existing products table if it exists (this will also drop its data)
DROP TABLE IF EXISTS products CASCADE;

-- Create products table for WooCommerce import with the new structure
CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2),
    sale_price NUMERIC(10, 2),
    regular_price NUMERIC(10, 2),
    stock_quantity INTEGER,
    image_url TEXT,
    categories TEXT[],
    tags TEXT[],
    sku TEXT,
    type TEXT,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow everyone to view products (since this is an e-commerce store)
CREATE POLICY "Products viewable by everyone" 
ON products FOR SELECT 
USING (true);

-- Create a policy to allow edge functions to insert/update products
CREATE POLICY "Edge functions can manage products" 
ON products FOR ALL 
USING (true);