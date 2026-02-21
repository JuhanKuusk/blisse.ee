import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  regular_price: number | null;
  sale_price: number | null;
  image_url: string | null;
  categories: string[] | null;
  status: string | null;
  type: string | null;
  sku: string | null;
  stock_quantity: number | null;
}

const Products = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blisse_products')
        .select('*')
        .eq('status', 'publish')
        .in('type', ['simple', 'variable'])
        .order('name');
      
      if (error) throw error;
      
      // Filter out treatments and treatment packages
      const excludedCategories = ['Salongihooldused', 'Hoolduspaketid'];
      const filteredProducts = (data as Product[]).filter(product => {
        if (!product.categories) return true;
        return !product.categories.some(cat => excludedCategories.includes(cat));
      });
      
      return filteredProducts;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4 text-destructive">Error loading products</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products ({products?.length || 0})</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-muted relative">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
              {product.sale_price && product.regular_price && product.sale_price < product.regular_price && (
                <Badge className="absolute top-2 right-2 bg-destructive">Sale</Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
              
              <div className="flex items-center gap-2 mb-2">
                {product.sale_price && product.regular_price && product.sale_price < product.regular_price ? (
                  <>
                    <span className="text-lg font-bold text-destructive">€{product.sale_price}</span>
                    <span className="text-sm text-muted-foreground line-through">€{product.regular_price}</span>
                  </>
                ) : (
                  <span className="text-lg font-bold">€{product.price || product.regular_price || 'N/A'}</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {product.categories?.slice(0, 2).map((cat, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {cat}
                  </Badge>
                ))}
                {product.type && (
                  <Badge variant="outline" className="text-xs">
                    {product.type}
                  </Badge>
                )}
              </div>
              
              {product.sku && (
                <p className="text-xs text-muted-foreground mt-2">SKU: {product.sku}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;