import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, CheckCircle } from "lucide-react";

const ProductSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; totalImported?: number } | null>(null);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsLoading(true);
    setSyncResult(null);
    
    try {
      toast({
        title: "Sync Started",
        description: "Importing products from WooCommerce store..."
      });

      const { data, error } = await supabase.functions.invoke('sync-woocommerce-products');
      
      if (error) {
        throw error;
      }

      setSyncResult(data);
      
      if (data.success) {
        toast({
          title: "Sync Completed",
          description: `Successfully imported ${data.totalImported} products`,
        });
      } else {
        toast({
          title: "Sync Failed",
          description: data.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync products. Please try again.",
        variant: "destructive"
      });
      setSyncResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            WooCommerce Product Sync
          </CardTitle>
          <CardDescription>
            Import all published products from kehastuudio.ee WooCommerce store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleSync} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing Products...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Start Product Import
              </>
            )}
          </Button>
          
          {syncResult && (
            <Card className={`${syncResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  {syncResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-red-600 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-medium ${syncResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {syncResult.success ? 'Sync Completed Successfully' : 'Sync Failed'}
                    </h4>
                    <p className={`text-sm ${syncResult.success ? 'text-green-700' : 'text-red-700'}`}>
                      {syncResult.message}
                    </p>
                    {syncResult.totalImported && (
                      <p className="text-sm text-green-600 mt-1">
                        {syncResult.totalImported} products imported
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductSync;