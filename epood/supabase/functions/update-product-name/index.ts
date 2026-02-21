import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, oldName, newName } = await req.json();

    if (!productId || !oldName || !newName) {
      return new Response(
        JSON.stringify({ error: "productId, oldName, and newName are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current product data
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      console.error("Fetch error:", fetchError);
      return new Response(
        JSON.stringify({ error: "Product not found", details: fetchError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Replace old name with new name in relevant fields
    const updatedName = product.name?.replace(new RegExp(oldName, 'gi'), newName) || product.name;
    const updatedDescription = product.description?.replace(new RegExp(oldName, 'gi'), newName) || product.description;

    // Update product
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update({
        name: updatedName,
        description: updatedDescription,
      })
      .eq("id", productId)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update product", details: updateError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Product ${productId} updated: ${product.name} -> ${updatedName}`);

    return new Response(
      JSON.stringify({
        success: true,
        oldName: product.name,
        newName: updatedName,
        product: updatedProduct,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
