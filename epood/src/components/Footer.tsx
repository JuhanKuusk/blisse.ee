import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/blisse-logo.png";

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: "Nahahooldus", href: "#skincare" },
      { name: "Kehahooldus", href: "#bodycare" },
      { name: "Kollageen", href: "#collagen" },
      { name: "Salongihooldused", href: "#salon" },
      { name: "Sooduspakkumised", href: "#deals" },
    ],
    info: [
      { name: "Meist", href: "#about" },
      { name: "Kontakt", href: "#contact" },
      { name: "Tarneinfo", href: "#shipping" },
      { name: "Tagastamine", href: "#returns" },
      { name: "Privaatsus", href: "#privacy" },
    ],
    brands: [
      { name: "Germaine de Capuccini", href: "#germaine" },
      { name: "Perris Swiss Laboratory", href: "#perris" },
      { name: "Fillerina", href: "#fillerina" },
      { name: "Crescina", href: "#crescina" },
      { name: "LPG", href: "#lpg" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/blisse.ee", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/blisse.ee", label: "Instagram" },
  ];

  return (
    <footer className="border-t" style={{ backgroundColor: '#fbe5db' }}>
      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img
                src={logo}
                alt="Blisse"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Professionaalsed keha- ja näohooldused Tallinnas. LPG massaaž,
              krüolipolüüs, RF lifting, HIFU ja palju muud.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+372 5880 2446</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@blisse.ee</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Tallinn, Eesti</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4">Pood</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary beauty-transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="font-semibold mb-4">Info</h4>
            <ul className="space-y-2">
              {footerLinks.info.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary beauty-transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="font-semibold mb-4">Brändid</h4>
            <ul className="space-y-2">
              {footerLinks.brands.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary beauty-transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary/20 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Blisse. Kõik õigused kaitstud.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="text-muted-foreground hover:text-primary beauty-transition"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;