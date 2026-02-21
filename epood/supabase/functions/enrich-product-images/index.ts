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

interface ImageResult {
  src: string;
  name: string;
  alt: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, limit = 5, offset = 0 } = await req.json();
    
    // Initialize clients
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    // Get WooCommerce credentials
    const storeUrl = Deno.env.get('WOOCOMMERCE_STORE_URL')!;
    const consumerKey = Deno.env.get('WOOCOMMERCE_CONSUMER_KEY')!;
    const consumerSecret = Deno.env.get('WOOCOMMERCE_CONSUMER_SECRET')!;
    const baseUrl = storeUrl.startsWith('http') ? storeUrl : `https://${storeUrl}`;
    const wcAuth = createWooCommerceAuth(consumerKey, consumerSecret);

    if (!FIRECRAWL_API_KEY || !LOVABLE_API_KEY) {
      throw new Error('Missing required API keys');
    }

    // If specific product ID, process just that one
    if (productId) {
      const result = await enrichSingleProduct(productId, supabase, FIRECRAWL_API_KEY, LOVABLE_API_KEY, baseUrl, wcAuth);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Otherwise, process a batch of products
    const { data: products, error: fetchError } = await supabase
      .from('woocommerce_products')
      .select('wc_id, name, slug, images')
      .order('wc_id', { ascending: true })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      throw new Error(`Failed to fetch products: ${fetchError.message}`);
    }

    const results = [];
    
    for (const product of products || []) {
      try {
        console.log(`Processing product: ${product.name} (ID: ${product.wc_id})`);
        
        const result = await enrichSingleProduct(
          product.wc_id, 
          supabase, 
          FIRECRAWL_API_KEY, 
          LOVABLE_API_KEY, 
          baseUrl, 
          wcAuth,
          product.name
        );
        
        results.push({
          productId: product.wc_id,
          name: product.name,
          ...result
        });
        
        // Rate limiting between products
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Error processing product ${product.wc_id}:`, error);
        results.push({
          productId: product.wc_id,
          name: product.name,
          status: 'error',
          error: error.message
        });
      }
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('woocommerce_products')
      .select('*', { count: 'exact', head: true });

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      total: count,
      hasMore: offset + limit < (count || 0),
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Image enrichment error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function enrichSingleProduct(
  productId: number,
  supabase: any,
  firecrawlKey: string,
  lovableKey: string,
  wcBaseUrl: string,
  wcAuth: string,
  productName?: string
): Promise<{ status: string; imagesFound?: number; error?: string }> {
  
  // Get product info if not provided
  if (!productName) {
    const { data: product, error } = await supabase
      .from('woocommerce_products')
      .select('name, slug, images, categories')
      .eq('wc_id', productId)
      .single();
    
    if (error || !product) {
      return { status: 'error', error: 'Product not found' };
    }
    productName = product.name;
  }

  console.log(`Searching images for: ${productName}`);

  // Search for product images using Firecrawl
  const searchQuery = `${productName} product image high quality`;
  
  const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${firecrawlKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: searchQuery,
      limit: 5,
      scrapeOptions: {
        formats: ['markdown', 'links']
      }
    }),
  });

  if (!searchResponse.ok) {
    const errorText = await searchResponse.text();
    console.error('Firecrawl search error:', errorText);
    return { status: 'error', error: 'Image search failed' };
  }

  const searchData = await searchResponse.json();
  console.log(`Found ${searchData.data?.length || 0} search results`);

  if (!searchData.data || searchData.data.length === 0) {
    return { status: 'no_results', imagesFound: 0 };
  }

  // Extract image URLs from search results
  const imageUrls: string[] = [];
  
  for (const result of searchData.data) {
    // Look for image URLs in the content
    const urlPattern = /(https?:\/\/[\s"'<>]+(?:jpg|jpeg|png|webp|gif))/gi;
    const matches = result.markdown?.match(urlPattern) || [];
    
    for (const match of matches) {
      // Filter for quality images (avoid small icons, thumbnails)
      if (!match.includes('icon') && 
          !match.includes('logo') && 
          !match.includes('favicon') &&
          !match.includes('thumb') &&
          !match.includes('small') &&
          !imageUrls.includes(match)) {
        imageUrls.push(match);
      }
    }
  }

  console.log(`Extracted ${imageUrls.length} potential image URLs`);

  if (imageUrls.length === 0) {
    return { status: 'no_images', imagesFound: 0 };
  }

  // Use AI to generate Estonian metadata for images
  const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: `Sa oled ekspert toote pildi metaandmete generaator. Sinu ülesanne on luua eestikeelsed nimed ja alt-tekstid toote piltidele.
          
Reegel:
- Nimi peaks olema lühike ja kirjeldav (3-6 sõna)
- Alt-tekst peaks olema pikem, SEO-sõbralik kirjeldus (10-20 sõna)
- Kasuta toote nime ja tüüpi kirjeldustes
- Lisa asjakohaseid märksõnu nagu "professionaalne", "kvaliteetne", jne.`
        },
        {
          role: 'user',
          content: `Genereeri metaandmed järgmistele toote piltidele.

Toote nimi: ${productName}
Piltide URL-id (${Math.min(imageUrls.length, 3)} pilti):
${imageUrls.slice(0, 3).map((url, i) => `${i + 1}. ${url}`).join('\n')}

Vasta JSON formaadis:
{
  "images": [
    {
      "src": "pildi_url",
      "name": "Eestikeelne pildi nimi",
      "alt": "Eestikeelne SEO-sõbralik alt-tekst kirjeldus"
    }
  ]
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
  });

  if (!aiResponse.ok) {
    console.error('AI API error:', await aiResponse.text());
    return { status: 'error', error: 'AI metadata generation failed' };
  }

  const aiData = await aiResponse.json();
  const aiContent = aiData.choices?.[0]?.message?.content || '';
  
  console.log('AI response:', aiContent);

  // Parse AI response
  let imageMetadata: ImageResult[] = [];
  try {
    // Extract JSON from response
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      imageMetadata = parsed.images || [];
    }
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
    // Fallback: create basic metadata
    imageMetadata = imageUrls.slice(0, 3).map((url, index) => ({
      src: url,
      name: `${productName} - pilt ${index + 1}`,
      alt: `${productName} professionaalne tootepilt`
    }));
  }

  if (imageMetadata.length === 0) {
    return { status: 'no_metadata', imagesFound: 0 };
  }

  // Update WooCommerce product with new images
  console.log(`Updating WooCommerce product ${productId} with ${imageMetadata.length} images`);
  
  const wcUpdateResponse = await fetch(
    `${wcBaseUrl}/wp-json/wc/v3/products/${productId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': wcAuth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: imageMetadata.map((img, index) => ({
          src: img.src,
          name: img.name,
          alt: img.alt,
          position: index
        }))
      })
    }
  );

  if (!wcUpdateResponse.ok) {
    const errorText = await wcUpdateResponse.text();
    console.error('WooCommerce update error:', errorText);
    return { status: 'wc_update_failed', error: errorText, imagesFound: imageMetadata.length };
  }

  const updatedProduct = await wcUpdateResponse.json();
  console.log(`Successfully updated product with ${updatedProduct.images?.length || 0} images`);

  // Also update local Supabase record
  await supabase
    .from('woocommerce_products')
    .update({
      images: imageMetadata.map((img, index) => ({
        src: img.src,
        name: img.name,
        alt: img.alt,
        position: index
      })),
      updated_at: new Date().toISOString()
    })
    .eq('wc_id', productId);

  return { 
    status: 'enriched', 
    imagesFound: imageMetadata.length 
  };
}
