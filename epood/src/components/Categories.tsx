import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import serum from "@/assets/serum-product.jpg";
import bodyCream from "@/assets/body-cream.jpg";
import haircare from "@/assets/haircare-products.jpg";
import bodycareDevices from "@/assets/bodycare-devices.jpg";

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

const categories = [
  {
    title: "Nahahooldus",
    description: "Premium seerumid, kreem ja maskid teie näonahale",
    image: serum,
    sectionId: "skincare",
    slug: "nahahooldus",
    gradient: "from-beauty-rose/80 to-beauty-coral/80",
    linkToPage: true
  },
  {
    title: "Kehahooldus",
    description: "Luksuslikud kehakreeμid ja hooldusseadmed",
    image: bodyCream,
    sectionId: "bodycare",
    slug: "kehahooldus",
    gradient: "from-beauty-coral/80 to-beauty-nude/80",
    linkToPage: true
  },
  {
    title: "Juustehooldus",
    description: "Kvaliteetsed šampoonid, palsamid ja juuksehooldustooted",
    image: haircare,
    sectionId: "haircare",
    slug: "juustehooldus",
    gradient: "from-beauty-nude/80 to-beauty-bronze/80",
    linkToPage: true
  },
  {
    title: "Kehahooldusseadmed",
    description: "Parimad seadmed kodukasutuseks",
    image: bodycareDevices,
    sectionId: "bodycare-devices",
    slug: "kehahooldusseadmed",
    gradient: "from-beauty-bronze/80 to-beauty-rose/80",
    linkToPage: true
  },
];

const ProductsSection = ({ category }: { category: typeof categories[0] }) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', category.title],
    queryFn: async () => {
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
        return product.categories.some(cat => 
          cat.toLowerCase().includes(category.title.toLowerCase())
        );
      });
      
      return filteredProducts;
    }
  });

  if (isLoading) {
    return (
      <div id={category.sectionId} className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{category.title}</h3>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="border-2 border-beauty-border">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div id={category.sectionId} className="mb-16">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">{category.title}</h3>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
        <Badge variant="secondary" className="hidden sm:block">
          {products.length} toodet
        </Badge>
      </div>
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
            category={product.categories?.[0] || category.title}
            isSale={!!(product.sale_price && product.regular_price && product.sale_price < product.regular_price)}
          />
        ))}
      </div>
    </div>
  );
};

const Categories = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-beauty-teal heading-decorated">
            Tootekategooriad
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leidke endale ideaalselt sobivad ilutooted meie hoolikalt valitud tootekategooriate valikust.
          </p>
        </div>

        {/* Category Cards Grid - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category, index) => (
            <div 
              key={category.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CategoryCard
                title={category.title}
                description={category.description}
                image={category.image}
                href={category.linkToPage ? `/kategooria/${category.slug}` : `#${category.sectionId}`}
                gradient={category.gradient}
                showProductsButton={category.linkToPage}
              />
            </div>
          ))}
        </div>

        {/* Products Sections - only show categories that don't link to page */}
        {categories.filter(cat => !cat.linkToPage).map((category) => (
          <ProductsSection key={category.title} category={category} />
        ))}
      </div>
    </section>
  );
};

export default Categories;