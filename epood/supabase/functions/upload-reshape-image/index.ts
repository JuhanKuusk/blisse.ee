import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.177.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, productId, fileName } = await req.json();

    if (!imageBase64 || !productId || !fileName) {
      return new Response(
        JSON.stringify({ error: "imageBase64, productId, and fileName are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract base64 data (remove data:image/xxx;base64, prefix if present)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    
    // Use Deno's standard library for proper base64 decoding
    const imageBuffer = decode(base64Data);
    
    console.log(`Uploading image ${fileName} for product ${productId}, size: ${imageBuffer.length} bytes`);

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageBuffer, {
        contentType: "image/jpeg",
        upsert: true
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to upload image", details: uploadError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    const newImageUrl = publicUrlData.publicUrl;
    console.log(`Image uploaded successfully: ${newImageUrl}`);

    // Update products table
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_url: newImageUrl })
      .eq("id", productId);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update product", details: updateError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Product ${productId} updated with new image URL`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        newImageUrl,
        productId,
        imageSize: imageBuffer.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
