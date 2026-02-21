import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to create WooCommerce API authentication
function createWooCommerceAuth(consumerKey: string, consumerSecret: string) {
  const credentials = btoa(`${consumerKey}:${consumerSecret}`);
  return `Basic ${credentials}`;
}

// Function to import WooCommerce products into Supabase
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get WooCommerce credentials from environment
    const storeUrl = Deno.env.get('WOOCOMMERCE_STORE_URL')!;
    const consumerKey = Deno.env.get('WOOCOMMERCE_CONSUMER_KEY')!;  
    const consumerSecret = Deno.env.get('WOOCOMMERCE_CONSUMER_SECRET')!;

    // Ensure the store URL has proper protocol
    const baseUrl = storeUrl.startsWith('http') ? storeUrl : `https://${storeUrl}`;

    console.log('Starting WooCommerce product import...');
    console.log('Store URL:', baseUrl);

    // Fetch products from WooCommerce using native fetch
    // Only published, non-virtual products
    const auth = createWooCommerceAuth(consumerKey, consumerSecret);
    
    let allProducts: any[] = [];
    let page = 1;
    const perPage = 100;
    
    // Paginate through all products
    while (true) {
      const productsResponse = await fetch(
        `${baseUrl}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}&status=publish`, 
        {
          headers: {
            'Authorization': auth,
            'Content-Type': 'application/json',
          }
        }
      );

      if (!productsResponse.ok) {
        throw new Error(`WooCommerce API error: ${productsResponse.status} ${productsResponse.statusText}`);
      }

      const products = await productsResponse.json();
      
      if (products.length === 0) {
        break;
      }
      
      // Filter out virtual products
      const physicalProducts = products.filter((product: any) => !product.virtual);
      allProducts = allProducts.concat(physicalProducts);
      
      console.log(`Page ${page}: Fetched ${products.length} products, ${physicalProducts.length} are non-virtual`);
      
      if (products.length < perPage) {
        break;
      }
      
      page++;
    }

    const products = allProducts;
    console.log(`Total: Fetched ${products.length} published, non-virtual products from WooCommerce`);

    // Transform and upsert products into Supabase
    const upsertPromises = products.map(async (product: any) => {
      try {
        const { error: productError } = await supabase
          .from('products')
          .upsert({
            id: product.id, // Use WC ID directly as primary key
            name: product.name,
            description: product.description,
            price: product.price ? parseFloat(product.price) : null,
            sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
            regular_price: product.regular_price ? parseFloat(product.regular_price) : null,
            stock_quantity: product.stock_quantity,
            image_url: product.images?.[0]?.src || null, // Use first image URL
            categories: product.categories?.map((cat: any) => cat.name) || [],
            tags: product.tags?.map((tag: any) => tag.name) || [],
            sku: product.sku,
            type: product.type || 'simple',
            status: product.status,
          }, { 
            onConflict: 'id'
          });

        if (productError) {
          console.error(`Error syncing product ${product.id}:`, productError);
          return;
        }

        console.log(`Successfully synced product: ${product.name} (ID: ${product.id})`);
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
      }
    });

    // Wait for all upserts to complete
    await Promise.all(upsertPromises);

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully imported ${products.length} products`,
      totalImported: products.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('WooCommerce import error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to import WooCommerce products',
      success: false,
      details: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});