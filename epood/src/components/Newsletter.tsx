import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Täname!",
        description: "Olete edukalt uudiskirjaga liitunud.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-16 beauty-gradient">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Saage esimesena teada uudistest
          </h2>
          <p className="text-white/90 mb-8">
            Liituge meie uudiskirjaga ja saage eksklusiivset teavet uute toodete, 
            eripakkumiste ja ilusoovituste kohta.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Teie e-maili aadress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:border-white"
              required
            />
            <Button
              type="submit"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 px-8"
            >
              Liitu
            </Button>
          </form>

          <p className="text-white/70 text-sm mt-4">
            Saadetame uudiskirja maksimaalselt kord nädalas. Saate alati tellimuse tühistada.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;