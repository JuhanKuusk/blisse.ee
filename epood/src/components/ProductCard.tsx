import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating = 5,
  isNew = false,
  isSale = false,
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/toode/${id}`}>
      <Card 
        className="group card-gradient border-2 border-beauty-border beauty-shadow hover:glow-effect beauty-transition hover:scale-105 cursor-pointer h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-64 object-cover beauty-transition group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="bg-beauty-coral text-white px-2 py-1 rounded-full text-xs font-medium">
                UUS
              </span>
            )}
            {isSale && (
              <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">
                SOODUSTUS
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
              }`} 
            />
          </Button>

          {/* Quick Add Button */}
          <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Button 
              className="w-full beauty-gradient text-white border-0 h-9"
              onClick={(e) => e.stopPropagation()}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Lisa ostukorvi
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs text-beauty-rose font-medium uppercase tracking-wide">
              {category}
            </span>
          </div>
          
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary beauty-transition">
            {name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({rating})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{price}€</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice}€
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default ProductCard;