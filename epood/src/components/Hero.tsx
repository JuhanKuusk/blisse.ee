import { Button } from "@/components/ui/button";
import heroImage from "@/assets/beauty-hero.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury beauty and spa treatments"
          className="h-full w-full object-cover animate-[scale-in_1.2s_ease-out]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container px-4 py-24 md:py-32">
        <div className="max-w-2xl">
          <div className="mb-6 inline-block animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              Tulemusteks loodud
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            For
            <span className="block bg-gradient-to-r from-primary to-beauty-coral bg-clip-text text-transparent">
              Blissful
            </span>
            Life
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-lg animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            Premium ilutooted ja professionaalsed hooldused, mis toovad esile
            teie loomuliku ilu.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
            <Button 
              size="lg" 
              className="bg-beauty-teal text-white border-0 beauty-shadow hover:bg-beauty-teal/90 hover:scale-105 beauty-transition"
            >
              Vaata tooteid
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-beauty-rose/20 rounded-full blur-xl hidden lg:block animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 right-40 w-20 h-20 bg-beauty-coral/30 rounded-full blur-lg hidden lg:block animate-[pulse_3s_ease-in-out_infinite_0.5s]" />
    </section>
  );
};

export default Hero;