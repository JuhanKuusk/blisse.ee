import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { limit = 10, offset = 0 } = await req.json().catch(() => ({}));

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!FIRECRAWL_API_KEY || !LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing API keys (FIRECRAWL or LOVABLE)" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch products that might need enrichment (missing INCI or short descriptions)
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("id, name, description, categories")
      .order("id", { ascending: true })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch products", details: fetchError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${products?.length || 0} products starting from offset ${offset}`);

    const results: any[] = [];
    
    for (const product of products || []) {
      console.log(`\n--- Processing: ${product.name} (ID: ${product.id}) ---`);
      
      // Check if product needs enrichment
      const description = product.description || '';
      const needsEnrichment = 
        !description.toLowerCase().includes('inci') ||
        !description.toLowerCase().includes('koostisosad:') ||
        description.length < 500;

      if (!needsEnrichment) {
        console.log(`Skipping ${product.name} - already has detailed info`);
        results.push({ id: product.id, name: product.name, status: "skipped", reason: "already enriched" });
        continue;
      }

      try {
        // Build search query based on product name and categories
        const categories = product.categories?.join(" ") || "";
        const searchQuery = `${product.name} ${categories} ingredients INCI koostisosad composition`;
        
        console.log(`Search query: ${searchQuery}`);

        // Search with Firecrawl
        const searchResponse = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchQuery,
            limit: 3,
            scrapeOptions: { formats: ["markdown"] },
          }),
        });

        if (!searchResponse.ok) {
          console.error(`Firecrawl failed for ${product.name}:`, await searchResponse.text());
          results.push({ id: product.id, name: product.name, status: "error", reason: "search failed" });
          continue;
        }

        const searchData = await searchResponse.json();
        const searchResults = searchData.data || [];
        
        if (searchResults.length === 0) {
          console.log(`No search results for ${product.name}`);
          results.push({ id: product.id, name: product.name, status: "no_results" });
          continue;
        }

        // Prepare web content
        const webContent = searchResults.map((r: any) => 
          `Source: ${r.url}\nTitle: ${r.title || 'N/A'}\nContent: ${r.markdown?.substring(0, 1500) || r.description || ''}`
        ).join("\n\n---\n\n");

        // AI extraction
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
                content: `Sa oled ilutoote ekspert. Analüüsi veebist leitud infot ja koosta struktureeritud tootekirjeldus EESTI KEELES.

Tagasta JSON:
{
  "shortDescription": "Ühe lause lühikirjeldus tootekaardile (max 100 tähemärki)",
  "mainDescription": "Põhjalik kirjeldus 2-3 lauset toote kohta",
  "benefits": ["Eelis 1", "Eelis 2", "Eelis 3"],
  "ingredients": [{"name": "Koostisosa", "percentage": "% kui teada", "description": "Mida teeb"}],
  "inciList": "Täielik INCI nimekiri kui leitud",
  "usage": "Kasutamisjuhised",
  "packageSize": "Pakendi suurus"
}

Ole täpne, kasuta AINULT leitud infot. Tühjad väljad jäta välja.`
              },
              {
                role: "user",
                content: `Toode: ${product.name}

Olemasolev kirjeldus:
${product.description || 'Puudub'}

Veebist leitud:
${webContent}

Koosta tooteinfo eesti keeles.`
              }
            ],
            tools: [{
              type: "function",
              function: {
                name: "extract_product_info",
                description: "Ekstrakti tooteinfo",
                parameters: {
                  type: "object",
                  properties: {
                    shortDescription: { type: "string" },
                    mainDescription: { type: "string" },
                    benefits: { type: "array", items: { type: "string" } },
                    ingredients: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          percentage: { type: "string" },
                          description: { type: "string" }
                        }
                      }
                    },
                    inciList: { type: "string" },
                    usage: { type: "string" },
                    packageSize: { type: "string" }
                  },
                  required: ["shortDescription"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "extract_product_info" } }
          }),
        });

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          console.error(`AI failed for ${product.name}:`, aiResponse.status, errText);
          
          if (aiResponse.status === 429) {
            results.push({ id: product.id, name: product.name, status: "rate_limited" });
            // Wait before continuing
            await new Promise(r => setTimeout(r, 5000));
            continue;
          }
          
          results.push({ id: product.id, name: product.name, status: "ai_error" });
          continue;
        }

        const aiData = await aiResponse.json();
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        
        if (!toolCall?.function?.arguments) {
          console.log(`No AI data for ${product.name}`);
          results.push({ id: product.id, name: product.name, status: "no_ai_data" });
          continue;
        }

        const enrichedData = JSON.parse(toolCall.function.arguments);
        console.log(`Enriched data for ${product.name}:`, JSON.stringify(enrichedData, null, 2));

        // Build enhanced description
        let newDescription = product.description || '';
        let updated = false;

        // Add main description if missing or short
        if (enrichedData.mainDescription && !newDescription.includes(enrichedData.mainDescription)) {
          if (newDescription.length < 200) {
            newDescription = `<p>${enrichedData.mainDescription}</p>\n\n` + newDescription;
            updated = true;
          }
        }

        // Add benefits if not present
        if (enrichedData.benefits?.length > 0 && !newDescription.toLowerCase().includes('miks valida')) {
          const benefitsHtml = enrichedData.benefits.map((b: string) => `✔ ${b}`).join('<br />\n');
          newDescription += `\n\n<p>Miks valida seda toodet?</p>\n<p>${benefitsHtml}</p>`;
          updated = true;
        }

        // Add INCI if missing
        if (enrichedData.inciList && !newDescription.toLowerCase().includes('inci')) {
          newDescription += `\n\n<p><strong>INCI:</strong> ${enrichedData.inciList}</p>`;
          updated = true;
        }

        // Add detailed ingredients if more info available
        if (enrichedData.ingredients?.length > 0) {
          const hasNewIngredients = enrichedData.ingredients.some((ing: any) => 
            ing.description && !newDescription.toLowerCase().includes(ing.name.toLowerCase())
          );
          
          if (hasNewIngredients) {
            const ingredientsList = enrichedData.ingredients
              .filter((ing: any) => ing.description)
              .map((ing: any) => {
                let line = ing.name;
                if (ing.percentage) line += ` (${ing.percentage})`;
                if (ing.description) line += ` – ${ing.description}`;
                return line;
              }).join('<br />\n');
            
            if (ingredientsList && !newDescription.includes(ingredientsList.substring(0, 50))) {
              newDescription += `\n\n<p>Koostisosad:</p>\n<p>${ingredientsList}</p>`;
              updated = true;
            }
          }
        }

        // Add usage if missing
        if (enrichedData.usage && !newDescription.toLowerCase().includes('kasutamine')) {
          newDescription += `\n\n<p>Kasutamine:</p>\n<p>${enrichedData.usage}</p>`;
          updated = true;
        }

        if (updated) {
          const { error: updateError } = await supabase
            .from("products")
            .update({ 
              description: newDescription,
              updated_at: new Date().toISOString()
            })
            .eq("id", product.id);

          if (updateError) {
            console.error(`Update failed for ${product.name}:`, updateError);
            results.push({ id: product.id, name: product.name, status: "update_error" });
          } else {
            console.log(`✓ Updated ${product.name}`);
            results.push({ 
              id: product.id, 
              name: product.name, 
              status: "enriched",
              shortDescription: enrichedData.shortDescription,
              ingredientsCount: enrichedData.ingredients?.length || 0,
              hasInci: !!enrichedData.inciList
            });
          }
        } else {
          results.push({ id: product.id, name: product.name, status: "no_new_data" });
        }

        // Rate limiting - wait between products
        await new Promise(r => setTimeout(r, 2000));

      } catch (productError) {
        console.error(`Error processing ${product.name}:`, productError);
        results.push({ id: product.id, name: product.name, status: "error", error: String(productError) });
      }
    }

    // Get total count for pagination info
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        totalProducts: count,
        nextOffset: offset + limit,
        hasMore: (offset + limit) < (count || 0),
        results
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Batch enrichment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
