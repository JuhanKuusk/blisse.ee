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

const brandConfig: Record<string, { title: string; description: string }> = {
  "germaine-de-capuccini": {
    title: "Germaine de Capuccini",
    description: "Hispaania luksuslik nahahoolduse bränd professionaalse kvaliteediga"
  },
  "labo": {
    title: "Labo tooted",
    description: "Šveitsi teadusel põhinevad innovaatilised ilutooted"
  },
  "collagenina": {
    title: "Collagenina",
    description: "Kollageenipõhised nahahooldustooted nooruslikuks nahaks"
  },
  "fillerina": {
    title: "Fillerina",
    description: "Dermaatiline täiteefektiga nahahooldus"
  },
  "crescina": {
    title: "Crescina",
    description: "Juuste väljalangemise vastased ja kasvu soodustavad tooted"
  },
  "perris-swiss-laboratory": {
    title: "Perris Swiss Laboratory",
    description: "Šveitsi luksuslik teaduspõhine nahahooldus"
  },
  "lpg": {
    title: "LPG",
    description: "Prantsuse professionaalsed kehahooldusseadmed"
  },
  "dodici": {
    title: "Dodici",
    description: "Kvaliteetsed ilutooted igapäevaseks kasutuseks"
  },
  "upgraders": {
    title: "Upgraders",
    description: "Innovaatilised nahahooldustooted"
  }
};

const Brand = () => {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? brandConfig[slug] : null;

  const { data: products, isLoading } = useQuery({
    queryKey: ['brand-products', slug],
    queryFn: async () => {
      if (!config) return [];
      
      const { data, error } = await supabase
        .from('blisse_products')
        .select('*')
        .eq('status', 'publish')
        .in('type', ['simple', 'variable'])
        .order('name');
      
      if (error) throw error;
      
      const filteredProducts = (data as Product[]).filter(product => {
        if (!product.categories) return false;
        return product.categories.some(cat => 
          cat.toLowerCase() === config.title.toLowerCase()
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
          <h1 className="text-3xl font-bold">Brändi ei leitud</h1>
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
          to="/#brands" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tagasi brändide juurde
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
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
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
        ) : (
          <p className="text-muted-foreground text-center py-12">
            Selle brändi tooteid ei leitud.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Brand;
