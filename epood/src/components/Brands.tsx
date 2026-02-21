import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

// Import all logos
import crescinaLogo from "@/assets/brands/crescina-logo.png";
import fillerinaLogo from "@/assets/brands/fillerina-logo.png";

import collageninaLogo from "@/assets/brands/collagenina-logo.png";
import germaineLogo from "@/assets/brands/germaine-logo.png";
import perrisLogo from "@/assets/brands/perris-logo.png";
import laboLogo from "@/assets/brands/labo-logo.png";
import dodiciLogo from "@/assets/brands/dodici-logo.png";
import upgradersLogo from "@/assets/brands/upgraders-logo.png";

interface Brand {
  name: string;
  slug: string;
  description: string;
  logo: string;
}

const brands: Brand[] = [
  {
    name: "Germaine de Capuccini",
    slug: "germaine-de-capuccini",
    description: "Hispaania luksuslik nahahoolduse bränd",
    logo: germaineLogo
  },
  {
    name: "Labo tooted",
    slug: "labo",
    description: "Šveitsi teadusel põhinevad ilutooted",
    logo: laboLogo
  },
  {
    name: "Collagenina",
    slug: "collagenina",
    description: "Kollageenipõhised nahahooldustooted",
    logo: collageninaLogo
  },
  {
    name: "Fillerina",
    slug: "fillerina",
    description: "Dermaatiline täiteefektiga nahahooldus",
    logo: fillerinaLogo
  },
  {
    name: "Crescina",
    slug: "crescina",
    description: "Juuste väljalangemise vastased tooted",
    logo: crescinaLogo
  },
  {
    name: "Perris Swiss Laboratory",
    slug: "perris-swiss-laboratory",
    description: "Šveitsi luksuslik nahahooldus",
    logo: perrisLogo
  },
  {
    name: "Dodici",
    slug: "dodici",
    description: "Kvaliteetsed ilutooted",
    logo: dodiciLogo
  },
  {
    name: "Upgraders",
    slug: "upgraders",
    description: "Innovaatilised nahahooldustooted",
    logo: upgradersLogo
  }
];

const Brands = () => {
  return (
    <section id="brands" className="py-16 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-beauty-teal heading-decorated">
            Meie brändid
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Esindame maailma juhtivaid ilubrände, mis pakuvad tipptasemel kvaliteeti ja tõhusust.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {brands.map((brand, index) => (
            <div 
              key={brand.slug}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Link to={`/brand/${brand.slug}`}>
                <Card className="group h-full border-2 border-border hover:border-primary/50 beauty-transition hover:shadow-lg cursor-pointer bg-card">
                  <CardContent className="p-4 flex flex-col h-full min-h-[160px]">
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="h-28 w-auto object-contain group-hover:scale-105 beauty-transition mix-blend-multiply"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center line-clamp-2 mt-auto">
                      {brand.description}
                    </p>
                    <div className="flex items-center justify-center text-xs text-beauty-teal mt-2 opacity-0 group-hover:opacity-100 beauty-transition">
                      <span>Vaata tooteid</span>
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;
