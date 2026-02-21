import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Check, Images } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Import all images with ReShape logo
import caviMainImage from "@/assets/cavi-face/cavi-face-main.jpg";
import caviDetail1 from "@/assets/cavi-face/cavi-face-detail-1.jpg";
import caviDetail2 from "@/assets/cavi-face/cavi-face-detail-2.jpg";
import caviDetail3 from "@/assets/cavi-face/cavi-face-detail-3.jpg";
import caviDetail4 from "@/assets/cavi-face/cavi-face-detail-4.jpg";
import caviDetail5 from "@/assets/cavi-face/cavi-face-detail-5.jpg";
import caviDetail6 from "@/assets/cavi-face/cavi-face-detail-6.jpg";
import caviDetail7 from "@/assets/cavi-face/cavi-face-detail-7.jpg";
import caviDetail8 from "@/assets/cavi-face/cavi-face-detail-8.jpg";
import caviDetail9 from "@/assets/cavi-face/cavi-face-detail-9.jpg";
import caviDetail10 from "@/assets/cavi-face/cavi-face-detail-10.jpg";

interface ProductImageUploaderProps {
  productId: number;
  currentImageUrl?: string | null;
  onImageUpdated?: (newUrl: string) => void;
}

const allImages = [
  { src: caviMainImage, name: "main" },
  { src: caviDetail1, name: "detail-1" },
  { src: caviDetail2, name: "detail-2" },
  { src: caviDetail3, name: "detail-3" },
  { src: caviDetail4, name: "detail-4" },
  { src: caviDetail5, name: "detail-5" },
  { src: caviDetail6, name: "detail-6" },
  { src: caviDetail7, name: "detail-7" },
  { src: caviDetail8, name: "detail-8" },
  { src: caviDetail9, name: "detail-9" },
  { src: caviDetail10, name: "detail-10" },
];

export const ProductImageUploader = ({ 
  productId, 
  currentImageUrl,
  onImageUpdated 
}: ProductImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploadingAll, setIsUploadingAll] = useState(false);
  const [isAllSuccess, setIsAllSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadLocalImage = async () => {
    setIsUploading(true);
    setIsSuccess(false);

    try {
      // Fetch the local image as blob
      const response = await fetch(caviMainImage);
      const blob = await response.blob();
      
      const timestamp = Date.now();
      const fileName = `reshape-cavi-face-${productId}-${timestamp}.jpg`;
      
      console.log('Uploading blob size:', blob.size, 'type:', blob.type);
      
      // Upload directly to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Viga",
          description: "Pildi üleslaadimine ebaõnnestus: " + uploadError.message,
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }

      console.log('Upload success:', uploadData);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      const newImageUrl = publicUrlData.publicUrl;
      console.log('New image URL:', newImageUrl);

      // Update products table
      const { error: updateError } = await supabase
        .from("blisse_products")
        .update({ image_url: newImageUrl })
        .eq("id", productId);

      if (updateError) {
        console.error('Update error:', updateError);
        toast({
          title: "Viga",
          description: "Toote uuendamine ebaõnnestus: " + updateError.message,
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }

      setIsSuccess(true);
      setIsUploading(false);
      
      toast({
        title: "Õnnestus!",
        description: "Toote pilt on uuendatud ReShape logoga",
      });

      if (onImageUpdated) {
        onImageUpdated(newImageUrl);
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Viga",
        description: "Midagi läks valesti",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  const uploadAllImages = async () => {
    setIsUploadingAll(true);
    setIsAllSuccess(false);
    setUploadProgress(0);

    try {
      const timestamp = Date.now();
      const uploadedUrls: { name: string; url: string }[] = [];

      for (let i = 0; i < allImages.length; i++) {
        const image = allImages[i];
        setUploadProgress(Math.round(((i + 1) / allImages.length) * 100));

        // Fetch the local image as blob
        const response = await fetch(image.src);
        const blob = await response.blob();
        
        const fileName = `reshape-cavi-face-${productId}-${image.name}-${timestamp}.jpg`;
        
        console.log(`Uploading ${image.name}:`, blob.size, 'bytes');
        
        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, blob, {
            contentType: "image/jpeg",
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${image.name}:`, uploadError);
          continue;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        uploadedUrls.push({
          name: image.name,
          url: publicUrlData.publicUrl
        });

        console.log(`Uploaded ${image.name}:`, publicUrlData.publicUrl);
      }

      // Update products table with main image
      const mainImage = uploadedUrls.find(u => u.name === "main");
      if (mainImage) {
        const { error: updateError } = await supabase
          .from("blisse_products")
          .update({ image_url: mainImage.url })
          .eq("id", productId);

        if (updateError) {
          console.error('Update error:', updateError);
        }

        if (onImageUpdated) {
          onImageUpdated(mainImage.url);
        }
      }

      // Update woocommerce_products table with all images
      const imagesJson = uploadedUrls.map((u, index) => ({
        id: index,
        src: u.url,
        name: u.name,
        alt: `ReShape Cavi + Face ${u.name}`
      }));

      const { error: wcUpdateError } = await supabase
        .from("woocommerce_products")
        .update({ images: imagesJson })
        .eq("wc_id", productId);

      if (wcUpdateError) {
        console.error('WooCommerce update error:', wcUpdateError);
      }

      setIsAllSuccess(true);
      setIsUploadingAll(false);
      
      toast({
        title: "Õnnestus!",
        description: `Kõik ${uploadedUrls.length} pilti on üles laetud`,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Viga",
        description: "Midagi läks valesti",
        variant: "destructive"
      });
      setIsUploadingAll(false);
    }
  };

  return (
    <div className="p-4 bg-card/50 border border-border rounded-lg">
      <p className="text-sm text-muted-foreground mb-3">Admin: Uuenda toote pilti andmebaasis</p>
      <div className="flex flex-col gap-3">
        <Button
          onClick={uploadLocalImage}
          disabled={isUploading || isSuccess || isUploadingAll}
          variant="outline"
          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Laadin üles...
            </>
          ) : isSuccess ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Uuendatud!
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Uuenda andmebaasi pilti
            </>
          )}
        </Button>

        <Button
          onClick={uploadAllImages}
          disabled={isUploadingAll || isAllSuccess || isUploading}
          variant="outline"
          className="border-green-500/50 text-green-400 hover:bg-green-500/10"
        >
          {isUploadingAll ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Laadin üles... {uploadProgress}%
            </>
          ) : isAllSuccess ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Kõik pildid uuendatud!
            </>
          ) : (
            <>
              <Images className="w-4 h-4 mr-2" />
              Laadi kõik pildid (11 tk)
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
