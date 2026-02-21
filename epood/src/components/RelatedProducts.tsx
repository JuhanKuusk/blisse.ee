import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number | null;
  regular_price: number | null;
  sale_price: number | null;
  image_url: string | null;
  categories: string[] | null;
}

interface RelatedProductsProps {
  currentProductId: number;
  categories: string[] | null;
  brandName: string;
}

const RelatedProducts = ({ currentProductId, categories, brandName }: RelatedProductsProps) => {
  const { data: relatedProducts, isLoading } = useQuery({
    queryKey: ['related-products', currentProductId, categories, brandName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blisse_products')
        .select('*')
        .eq('status', 'publish')
        .in('type', ['simple', 'variable'])
        .neq('id', currentProductId)
        .order('name')
        .limit(50);
      
      if (error) throw error;
      
      // Filter by brand or category
      const excludedCategories = ['Salongihooldused', 'Hoolduspaketid'];
      const filtered = (data as Product[]).filter(product => {
        if (!product.categories) return false;
        const hasExcluded = product.categories.some(cat => excludedCategories.includes(cat));
        if (hasExcluded) return false;
        
        // Check if same brand
        const productText = [...(product.categories || []), product.name].join(' ').toLowerCase();
        const isSameBrand = brandName !== 'default' && productText.includes(brandName.toLowerCase());
        
        // Check if same category
        const hasSharedCategory = categories?.some(cat => 
          product.categories?.includes(cat)
        );
        
        return isSameBrand || hasSharedCategory;
      });
      
      // Sort by brand match first, then by category match
      filtered.sort((a, b) => {
        const aText = [...(a.categories || []), a.name].join(' ').toLowerCase();
        const bText = [...(b.categories || []), b.name].join(' ').toLowerCase();
        const aIsBrand = brandName !== 'default' && aText.includes(brandName.toLowerCase());
        const bIsBrand = brandName !== 'default' && bText.includes(brandName.toLowerCase());
        
        if (aIsBrand && !bIsBrand) return -1;
        if (!aIsBrand && bIsBrand) return 1;
        return 0;
      });
      
      return filtered.slice(0, 3);
    },
    enabled: !!(categories?.length || brandName !== 'default')
  });

  if (isLoading) {
    return (
      <section className="py-12 border-t border-border">
        <div className="container px-4">
          <h2 className="text-2xl font-bold mb-6">Seotud tooted</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-3">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-border">
      <div className="container px-4">
        <h2 className="text-2xl font-bold mb-6">Seotud tooted</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedProducts.map((product) => (
            <Link key={product.id} to={`/toode/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
                <div className="aspect-square bg-white relative overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                  {product.sale_price && product.regular_price && product.sale_price < product.regular_price && (
                    <Badge className="absolute top-2 right-2 bg-destructive text-xs">Sale</Badge>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
                  
                  <div className="flex items-center gap-2">
                    {product.sale_price && product.regular_price && product.sale_price < product.regular_price ? (
                      <>
                        <span className="font-bold text-destructive">€{product.sale_price}</span>
                        <span className="text-xs text-muted-foreground line-through">€{product.regular_price}</span>
                      </>
                    ) : (
                      <span className="font-bold">€{product.price || product.regular_price || 'N/A'}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
