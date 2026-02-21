import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Upload, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

// Import the edited ReShape images
import transionReshapeImage from "@/assets/transion-homepro-reshape-v3.jpg";

interface ProductToRebrand {
  id: number;
  name: string;
  currentImageUrl: string;
  newImagePath: string;
  newImageImport: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
}

const ImageRebranding = () => {
  const [products, setProducts] = useState<ProductToRebrand[]>([
    {
      id: 24304,
      name: "Zlimline Transion HomePro → ReShape Transion HomePro",
      currentImageUrl: "https://backend.kehastuudio.ee/wp-content/uploads/2022/02/Zlimline-transion-scaled-1.jpg",
      newImagePath: "transion-homepro-reshape.jpg",
      newImageImport: transionReshapeImage,
      status: 'pending'
    }
  ]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoStarted, setAutoStarted] = useState(false);

  const uploadAndUpdateProduct = async (product: ProductToRebrand) => {
    try {
      // Update status to uploading
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, status: 'uploading' as const } : p
      ));

      // Fetch the local image and convert to base64
      const response = await fetch(product.newImageImport);
      const blob = await response.blob();
      
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      const imageBase64 = await base64Promise;
      
      const fileName = `reshape-${product.id}-${Date.now()}.jpg`;
      
      // Call edge function to upload and update
      const { data, error } = await supabase.functions.invoke("upload-local-image", {
        body: {
          productId: product.id,
          imageBase64,
          fileName,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || "Unknown error");
      }

      console.log("Uploaded to:", data.imageUrl);

      // Update status to done
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, status: 'done' as const } : p
      ));

      toast.success(`${product.name} pilt uuendatud!`);

    } catch (error) {
      console.error("Error:", error);
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, status: 'error' as const } : p
      ));
      toast.error(`Viga: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const processAllProducts = async () => {
    setIsProcessing(true);
    for (const product of products) {
      if (product.status === 'pending') {
        await uploadAndUpdateProduct(product);
      }
    }
    setIsProcessing(false);
  };

  // Auto-start upload on mount
  useEffect(() => {
    if (!autoStarted && products.some(p => p.status === 'pending')) {
      setAutoStarted(true);
      processAllProducts();
    }
  }, [autoStarted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="container max-w-4xl mx-auto">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Tagasi</span>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Tootepiltide Rebranding</h1>
        <p className="text-slate-400 mb-8">
          Siin saad uuendada tootepilte, asendades Zlimline brändingu ReShape brändinguga.
        </p>

        <div className="space-y-4 mb-8">
          {products.map((product) => (
            <Card key={product.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Praegune pilt:</p>
                    <img 
                      src={product.currentImageUrl} 
                      alt="Current" 
                      className="w-full h-40 object-contain bg-slate-700 rounded"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Uus ReShape pilt:</p>
                    <img 
                      src={product.newImageImport} 
                      alt="New ReShape" 
                      className="w-full h-40 object-contain bg-slate-700 rounded"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {product.status === 'pending' && (
                      <span className="text-amber-400 text-sm">Ootel</span>
                    )}
                    {product.status === 'uploading' && (
                      <span className="text-blue-400 text-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Üleslaadimine...
                      </span>
                    )}
                    {product.status === 'done' && (
                      <span className="text-emerald-400 text-sm flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Valmis!
                      </span>
                    )}
                    {product.status === 'error' && (
                      <span className="text-rose-400 text-sm">Viga</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => uploadAndUpdateProduct(product)}
                    disabled={product.status === 'uploading' || product.status === 'done'}
                    className="bg-cyan-600 hover:bg-cyan-500"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Uuenda pilt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          onClick={processAllProducts}
          disabled={isProcessing || products.every(p => p.status === 'done')}
          className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Töötlemine...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Uuenda kõik pildid
            </>
          )}
        </Button>

        {products.every(p => p.status === 'done') && (
          <div className="mt-8 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg">
            <p className="text-emerald-400 text-center">
              Kõik pildid on uuendatud! <Link to="/toode/24304" className="underline">Vaata toodet</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageRebranding;
