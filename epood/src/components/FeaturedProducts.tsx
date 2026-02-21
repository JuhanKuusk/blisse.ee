import ProductCard from "./ProductCard";
import serum from "@/assets/serum-product.jpg";
import bodyCream from "@/assets/body-cream.jpg";
import collagen from "@/assets/collagen-supplement.jpg";

const FeaturedProducts = () => {
  const products = [
    {
      id: "1",
      name: "Defined & Fit 24h Premium Seerum",
      price: "109.25",
      originalPrice: "125.00",
      image: serum,
      category: "Nahahooldus",
      rating: 5,
      isNew: true,
      isSale: true,
    },
    {
      id: "2",
      name: "Discovery Kit Booster Set 3x10ml",
      price: "62.00",
      image: bodyCream,
      category: "Kehahooldus",
      rating: 5,
      isNew: false,
      isSale: false,
    },
    {
      id: "3",
      name: "Flash Detox Mask Premium",
      price: "65.00",
      image: collagen,
      category: "Kollageen",
      rating: 5,
      isNew: true,
      isSale: false,
    },
    {
      id: "4",
      name: "Hydrating Body Cream Luxe",
      price: "45.00",
      originalPrice: "59.00",
      image: bodyCream,
      category: "Kehahooldus",
      rating: 4,
      isNew: false,
      isSale: true,
    },
    {
      id: "5",
      name: "Collagen Boost Supplement",
      price: "89.00",
      image: collagen,
      category: "Kollageen",
      rating: 5,
      isNew: true,
      isSale: false,
    },
    {
      id: "6",
      name: "Vitamin C Brightening Serum",
      price: "78.50",
      originalPrice: "95.00",
      image: serum,
      category: "Nahahooldus",
      rating: 5,
      isNew: false,
      isSale: true,
    },
  ];

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Populaarsed
            <span className="block bg-gradient-to-r from-primary to-beauty-coral bg-clip-text text-transparent">
              Tooted
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Avasta meie kõige armastatum valiku premium ilutooteid, 
            mis on pälvinud klientide südamed üle maailma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;