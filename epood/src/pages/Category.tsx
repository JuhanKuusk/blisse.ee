import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

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

const categoryConfig: Record<string, { title: string; description: string }> = {
  nahahooldus: {
    title: "Nahahooldus",
    description: "Premium seerumid, kreem ja maskid teie näonahale"
  },
  kehahooldus: {
    title: "Kehahooldus",
    description: "Luksuslikud kehakreeμid ja hooldusseadmed"
  },
  juustehooldus: {
    title: "Juustehooldus",
    description: "Kvaliteetsed šampoonid, palsamid ja juuksehooldustooted"
  },
  kehahooldusseadmed: {
    title: "Kehahooldusseadmed",
    description: "Parimad seadmed kodukasutuseks"
  }
};

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? categoryConfig[slug] : null;

  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', slug],
    queryFn: async () => {
      if (!config) return [];
      
      const { data, error } = await supabase
        .from('blisse_products')
        .select('*')
        .eq('status', 'publish')
        .in('type', ['simple', 'variable'])
        .order('name');
      
      if (error) throw error;
      
      const excludedCategories = ['Salongihooldused', 'Hoolduspaketid'];
      const filteredProducts = (data as Product[]).filter(product => {
        if (!product.categories) return false;
        const hasExcluded = product.categories.some(cat => excludedCategories.includes(cat));
        if (hasExcluded) return false;
        
        // Special handling: "Kehahooldus" should not include "Kehahooldusseadmed" products
        if (config.title === "Kehahooldus") {
          const hasDevices = product.categories.some(cat => cat.toLowerCase().includes("kehahooldusseadmed"));
          if (hasDevices) return false;
        }
        
        return product.categories.some(cat => 
          cat.toLowerCase().includes(config.title.toLowerCase())
        );
      });
      
      return filteredProducts;
    },
    enabled: !!config
  });

  if (!config) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-16">
          <h1 className="text-3xl font-bold">Kategooriat ei leitud</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Tagasi avalehele
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tagasi avalehele
        </Link>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{config.title}</h1>
            <p className="text-muted-foreground">{config.description}</p>
          </div>
          {products && (
            <Badge variant="secondary" className="hidden sm:block text-base px-4 py-1">
              {products.length} toodet
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Card key={i} className="border-2 border-beauty-border">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-3">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id.toString()}
                name={product.name}
                price={product.sale_price && product.regular_price && product.sale_price < product.regular_price 
                  ? product.sale_price.toString() 
                  : (product.price || product.regular_price || 0).toString()}
                originalPrice={product.sale_price && product.regular_price && product.sale_price < product.regular_price 
                  ? product.regular_price.toString() 
                  : undefined}
                image={product.image_url || '/placeholder.svg'}
                category={product.categories?.[0] || config.title}
                isSale={!!(product.sale_price && product.regular_price && product.sale_price < product.regular_price)}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Category;
