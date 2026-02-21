-- Add custom content fields for product pages
ALTER TABLE public.woocommerce_products 
ADD COLUMN IF NOT EXISTS benefits jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS full_ingredients text DEFAULT NULL;

-- Add comment to describe the columns
COMMENT ON COLUMN public.woocommerce_products.benefits IS 'Array of product benefits/reasons to use (Miks kasutada)';
COMMENT ON COLUMN public.woocommerce_products.full_ingredients IS 'Full INCI ingredients list (Millest koosneb)';