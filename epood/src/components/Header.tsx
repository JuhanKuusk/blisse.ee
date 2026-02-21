import { useState } from "react";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/blisse-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToBrands = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If we're not on the homepage, navigate first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const brandsSection = document.getElementById('brands');
        if (brandsSection) {
          brandsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on homepage, just scroll
      const brandsSection = document.getElementById('brands');
      if (brandsSection) {
        brandsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navigation = [
    { name: "Nahale", href: "/kategooria/nahahooldus" },
    { name: "Kehale", href: "/kategooria/kehahooldus" },
    { name: "Juustele", href: "/kategooria/juuksehooldus" },
    { name: "Seadmed", href: "/kategooria/kehahooldusseadmed" },
    { name: "Hooldused", href: "https://blisse.ee/salongihooldused.html", isExternal: true },
    { name: "Broneeri", href: "https://blisse.ee/booking.html", isExternal: true, isHighlighted: true },
    { name: "Brändid", href: "#brands", isScrollLink: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Blisse"
            className="h-10 md:h-14 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            item.isScrollLink ? (
              <button
                key={item.name}
                onClick={scrollToBrands}
                className="text-sm font-medium text-foreground border border-beauty-peach rounded px-2 py-1 transition-colors hover:text-foreground/70 hover:bg-beauty-peach/10"
              >
                {item.name}
              </button>
            ) : item.isExternal ? (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-medium transition-colors ${
                  item.isHighlighted 
                    ? "bg-primary text-primary-foreground rounded px-3 py-1.5 hover:bg-primary/90" 
                    : "text-foreground border border-beauty-peach rounded px-2 py-1 hover:text-foreground/70 hover:bg-beauty-peach/10"
                }`}
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-foreground border border-beauty-peach rounded px-2 py-1 transition-colors hover:text-foreground/70 hover:bg-beauty-peach/10"
              >
                {item.name}
              </Link>
            )
          ))}
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Otsi..."
                className="w-40 pl-9 h-9 text-sm"
              />
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              0
            </span>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Otsi tooteid..."
                  className="w-full pl-10"
                />
              </div>
            </div>
            <nav className="space-y-2">
              {navigation.map((item) => (
                item.isScrollLink ? (
                  <button
                    key={item.name}
                    onClick={(e) => {
                      scrollToBrands(e);
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-sm font-medium text-foreground transition-colors hover:text-foreground/70 w-full text-left"
                  >
                    {item.name}
                  </button>
                ) : item.isExternal ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block py-2 text-sm font-medium transition-colors ${
                      item.isHighlighted 
                        ? "bg-primary text-primary-foreground rounded px-3 inline-block" 
                        : "text-foreground hover:text-foreground/70"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block py-2 text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;