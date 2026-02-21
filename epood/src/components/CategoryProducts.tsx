import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: number;
  name: string;
  price: number | null;
  regular_price: number | null;
  sale_price: number | null;
  image_url: string | null;
  categories: string[] | null;
  type: string | null;
}

interface CategoryProductsProps {
  categoryName: string;
  categoryTitle: string;
  categoryDescription: string;
  sectionId: string;
}

const CategoryProducts = ({ categoryName, categoryTitle, categoryDescription, sectionId }: CategoryProductsProps) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', categoryName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blisse_products')
        .select('*')
        .eq('status', 'publish')
        .in('type', ['simple', 'variable'])
        .order('name');
      
      if (error) throw error;
      
      // Filter products that belong to this category and exclude treatments
      const excludedCategories = ['Salongihooldused', 'Hoolduspaketid'];
      const filteredProducts = (data as Product[]).filter(product => {
        if (!product.categories) return false;
        const hasExcluded = product.categories.some(cat => excludedCategories.includes(cat));
        if (hasExcluded) return false;
        return product.categories.some(cat => 
          cat.toLowerCase().includes(categoryName.toLowerCase())
        );
      });
      
      return filteredProducts;
    }
  });

  if (isLoading) {
    return (
      <section id={sectionId} className="py-12">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{categoryTitle}</h2>
          <p className="text-muted-foreground mb-6">{categoryDescription}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
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

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section id={sectionId} className="py-12">
      <div className="container px-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{categoryTitle}</h2>
            <p className="text-muted-foreground">{categoryDescription}</p>
          </div>
          <Badge variant="secondary" className="hidden sm:block">
            {products.length} toodet
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="aspect-square bg-muted relative overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryProducts;