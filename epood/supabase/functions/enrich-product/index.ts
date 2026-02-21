import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, searchQuery } = await req.json();
    
    if (!productId) {
      return new Response(
        JSON.stringify({ error: "Product ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch the product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      console.error("Product fetch error:", productError);
      return new Response(
        JSON.stringify({ error: "Product not found", details: productError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing product: ${product.name}`);

    // Build search query
    const query = searchQuery || `${product.name} ingredients INCI koostisosad`;
    console.log(`Search query: ${query}`);

    // Search using Firecrawl
    let searchResults: any[] = [];
    if (FIRECRAWL_API_KEY) {
      try {
        console.log("Searching with Firecrawl...");
        const searchResponse = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query,
            limit: 5,
            scrapeOptions: {
              formats: ["markdown"],
            },
          }),
        });

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          searchResults = searchData.data || [];
          console.log(`Found ${searchResults.length} search results`);
        } else {
          console.error("Firecrawl search failed:", await searchResponse.text());
        }
      } catch (e) {
        console.error("Firecrawl error:", e);
      }
    }

    // Prepare content for AI processing
    const webContent = searchResults.map((r: any) => 
      `Source: ${r.url}\nTitle: ${r.title || 'N/A'}\nContent: ${r.markdown?.substring(0, 2000) || r.description || ''}`
    ).join("\n\n---\n\n");

    if (!webContent && !LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No web content found and AI not available",
          product: product 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use AI to extract and format product information
    let enrichedData: any = null;
    if (LOVABLE_API_KEY && webContent) {
      console.log("Processing with AI...");
      
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `Sa oled ilutoote ekspert. Sinu ülesanne on analüüsida veebist leitud infot ja koostada struktureeritud tootekirjeldus eesti keeles.

Tagasta JSON objekt järgmise struktuuriga:
{
  "shortDescription": "Lühike ühe lause kirjeldus toote peamisest eesmärgist",
  "benefits": ["Eelis 1", "Eelis 2", ...],
  "ingredients": [
    {"name": "Koostisosa nimi", "percentage": "protsent kui teada", "description": "Kirjeldus"},
    ...
  ],
  "inciList": "Täielik INCI koostisosade nimekiri kui leitud",
  "usage": "Kasutamisjuhised",
  "warnings": "Hoiatused või vastunäidustused kui on",
  "packageSize": "Pakendi suurus"
}

Ole täpne ja kasuta ainult leitud infot. Kui midagi pole teada, jäta väli tühjaks.`
            },
            {
              role: "user",
              content: `Toote nimi: ${product.name}

Olemasolev kirjeldus:
${product.description || 'Puudub'}

Veebist leitud info:
${webContent}

Palun analüüsi ja koosta struktureeritud tooteinfo.`
            }
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "extract_product_info",
                description: "Ekstrakti struktureeritud tooteinfo",
                parameters: {
                  type: "object",
                  properties: {
                    shortDescription: { type: "string", description: "Lühike ühe lause kirjeldus" },
                    benefits: { 
                      type: "array", 
                      items: { type: "string" },
                      description: "Toote eelised ja kasud"
                    },
                    ingredients: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          percentage: { type: "string" },
                          description: { type: "string" }
                        },
                        required: ["name"]
                      },
                      description: "Koostisosade nimekiri"
                    },
                    inciList: { type: "string", description: "INCI koostisosade nimekiri" },
                    usage: { type: "string", description: "Kasutamisjuhised" },
                    warnings: { type: "string", description: "Hoiatused" },
                    packageSize: { type: "string", description: "Pakendi suurus" }
                  },
                  required: ["shortDescription", "ingredients"]
                }
              }
            }
          ],
          tool_choice: { type: "function", function: { name: "extract_product_info" } }
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        console.log("AI response received");
        
        // Extract tool call result
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall?.function?.arguments) {
          try {
            enrichedData = JSON.parse(toolCall.function.arguments);
            console.log("Extracted data:", JSON.stringify(enrichedData, null, 2));
          } catch (e) {
            console.error("Failed to parse AI response:", e);
          }
        }
      } else {
        const errorText = await aiResponse.text();
        console.error("AI error:", aiResponse.status, errorText);
        
        if (aiResponse.status === 429) {
          return new Response(
            JSON.stringify({ error: "AI rate limit exceeded, please try again later" }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (aiResponse.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI credits exhausted, please add funds" }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Build enhanced description if we have enriched data
    if (enrichedData) {
      let newDescription = product.description || '';
      
      // Check if INCI list is not already in description
      if (enrichedData.inciList && !newDescription.toLowerCase().includes('inci')) {
        newDescription += `\n\n<p><strong>INCI:</strong> ${enrichedData.inciList}</p>`;
      }
      
      // Add ingredients if they have more info than existing
      if (enrichedData.ingredients && enrichedData.ingredients.length > 0) {
        const hasDetailedIngredients = enrichedData.ingredients.some((ing: any) => ing.description);
        
        if (hasDetailedIngredients && !newDescription.includes('Koostisosad:')) {
          const ingredientsList = enrichedData.ingredients.map((ing: any) => {
            let line = ing.name;
            if (ing.percentage) line += ` (${ing.percentage})`;
            if (ing.description) line += ` – ${ing.description}`;
            return line;
          }).join('<br />\n');
          
          newDescription += `\n\n<p>Koostisosad:</p>\n<p>${ingredientsList}</p>`;
        }
      }

      // Update product if description changed
      if (newDescription !== product.description) {
        const { error: updateError } = await supabase
          .from("products")
          .update({ 
            description: newDescription,
            updated_at: new Date().toISOString()
          })
          .eq("id", productId);

        if (updateError) {
          console.error("Update error:", updateError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Failed to update product", 
              details: updateError,
              enrichedData 
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log("Product updated successfully");
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        productId,
        productName: product.name,
        enrichedData,
        searchResultsCount: searchResults.length,
        message: enrichedData ? "Product enriched successfully" : "No new data found"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in enrich-product function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
