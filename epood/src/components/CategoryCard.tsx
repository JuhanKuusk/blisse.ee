import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  gradient?: string;
  showProductsButton?: boolean;
}

const CategoryCard = ({
  title,
  description,
  image,
  href,
  gradient = "from-beauty-rose/80 to-beauty-coral/80",
  showProductsButton = false
}: CategoryCardProps) => {
  const isExternalLink = href.startsWith('#');
  
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isExternalLink) {
      return (
        <a href={href} className="block">
          {children}
        </a>
      );
    }
    return (
      <Link to={href} className="block">
        {children}
      </Link>
    );
  };

  return (
    <CardWrapper>
      <Card className="group overflow-hidden border-0 beauty-shadow hover:glow-effect beauty-transition hover:scale-105 cursor-pointer">
        <CardContent className="p-0 relative h-80">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover beauty-transition group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-6 text-white">
            <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <p className="text-white/90 mb-4 line-clamp-2">{description}</p>
              
              {showProductsButton ? (
                <div className="inline-flex items-center gap-2 bg-beauty-teal backdrop-blur-sm border border-beauty-teal rounded-full px-4 py-2 text-sm font-semibold text-white hover:bg-beauty-teal/90 transition-colors">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Vaata tooteid</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              ) : (
                <div className="flex items-center text-sm font-medium">
                  <span>Vaata rohkem</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 beauty-transition" />
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

export default CategoryCard;