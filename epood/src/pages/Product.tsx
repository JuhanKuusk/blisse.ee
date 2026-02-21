import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RelatedProducts from "@/components/RelatedProducts";
import ProductDeviceTemplate from "@/components/ProductDeviceTemplate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShoppingBag, Heart, Sparkles, Users, FlaskConical, CheckCircle, Sun, Moon, Info, Leaf, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  regular_price: number | null;
  sale_price: number | null;
  image_url: string | null;
  categories: string[] | null;
  sku: string | null;
  type: string | null;
}

// Custom product content (Miks kasutada + Peamised omadused + INCI koostis)
const productCustomContent: Record<number, { benefits: string[]; properties?: string[]; ingredients: string }> = {
  // PERRIS SWISS LABORATORY Active Anti-Aging Eye Cream 15ml
  330402: {
    benefits: [
      "Vähendab tursete ilmnemist",
      "Aitab vabaneda pundunud silmaalustest",
      "Vähendab tumedate silmaaluste teket",
      "Ülim niisutus, mis kestab 24 tundi"
    ],
    properties: [
      "Silmaümbruskreem vananemisvastase toimega",
      "Sisaldab roosivett ja sheavõid",
      "Rikastatud C-vitamiini ja hüaluroonhappega",
      "Sobib tundlikule silmaümbrusele",
      "Lõhnavaba",
      "15ml pakend"
    ],
    ingredients: "AQUA (WATER), ROSA DAMASCENA (ROSE) FLOWER WATER, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, DICAPRYLYL CARBONATE, BUTYROSPERMUM PARKII (SHEA) BUTTER, GLYCERIN, POLYGLYCERYL-3 METHYLGLUCOSE DISTEARATE, CETYL ALCOHOL, CAPRYLOYL GLYCINE, SODIUM STEAROYL GLUTAMATE, TOCOTRIENOLS, TOCOPHEROL, TOCOPHERYL ACETATE, ASCORBYL GLUCOSIDE, SODIUM HYALURONATE, SODIUM DEXTRAN SULFATE, BISABOLOL, ELAEIS GUINEENSIS (PALM) FRUIT EXTRACT, AGAR, XANTHAN GUM, BENZOIC ACID, LECITHIN, CAPRYLYL GLYCOL, 1,2-HEXANEDIOL, SORBITAN LAURATE, CAPRYLIC/CAPRIC TRIGLYCERIDE, BIOSACCHARIDE GUM-1, GLYCERYL CAPRYLATE, SODIUM CITRATE, SODIUM ANISATE, SODIUM LEVULINATE, POTASSIUM SORBATE, SODIUM BENZOATE, SODIUM HYDROXIDE, ACID CITRIC."
  },
  // Collagenina 6 kollageeniga tihendav, pinguldav intensiivhooldus tase 2
  334803: {
    benefits: [
      "Tihendab ja pinguldab nahka",
      "Parandab naha elastsust",
      "Vähendab peeneid jooni ja kortse",
      "Tagab intensiivse niisutuse",
      "Nähtavad tulemused juba 10 päevaga"
    ],
    properties: [
      "6 erineva molekulmassiga kollageeni",
      "Intensiivne 10-päevane kuur",
      "Tase 2 - mõõduka vananemise korral",
      "Sisaldab hüaluroonhapet",
      "Dermatiloogiliselt testitud"
    ],
    ingredients: "AQUA, GLYCERIN, HYDROLYZED COLLAGEN, SODIUM HYALURONATE, BUTYLENE GLYCOL, CARBOMER, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN, PARFUM, DISODIUM EDTA, SODIUM HYDROXIDE."
  },
  // Fillerina 12HA silmaümbruskreem-emulsioon Everyday Formula tase 5
  334762: {
    benefits: [
      "Täidab silmaümbruse kortsukesi",
      "Vähendab silmaaluste turset",
      "Silub peeneid jooni silmaümbruses",
      "Niisutab ja toitab õrna silmaümbrust",
      "Kohene pinguldav efekt"
    ],
    properties: [
      "12 hüaluroonhappe molekuli",
      "Tase 5 - süvendatud kortsude korral",
      "Igapäevaseks kasutamiseks",
      "Sobib tundlikule silmaümbrusele",
      "25ml pakend"
    ],
    ingredients: "AQUA, CAPRYLIC/CAPRIC TRIGLYCERIDE, GLYCERIN, CETEARYL ALCOHOL, SODIUM HYALURONATE, HYDROLYZED HYALURONIC ACID, HYALURONIC ACID, TOCOPHERYL ACETATE, RETINYL PALMITATE, ASCORBYL TETRAISOPALMITATE, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN."
  },
  // CRESCINA TRANSDERMIC shampoon HFSC meestele
  334769: {
    benefits: [
      "Tugevdab juuksejuurt",
      "Aeglustab juuste väljalangemist",
      "Stimuleerib juuksekasvu",
      "Puhastab peanahka õrnalt",
      "Sobib igapäevaseks kasutamiseks"
    ],
    properties: [
      "Transdermaalse tehnoloogiaga",
      "HFSC kompleks juuksekasvu soodustamiseks",
      "Spetsiaalselt meestele loodud",
      "Ei sisalda sulfaate",
      "200ml pakend"
    ],
    ingredients: "AQUA, SODIUM LAUROYL SARCOSINATE, COCAMIDOPROPYL BETAINE, GLYCERIN, CYSTEINE, LYSINE, GLYCOPROTEIN, SERENOA SERRULATA FRUIT EXTRACT, PHENOXYETHANOL, CITRIC ACID, PARFUM."
  },
  // Germaine de Capuccini Rescue Feet
  335011: {
    benefits: [
      "Taastab kuiva ja lõhenenud kanna naha",
      "Pehmendab kõvastunud nahka",
      "Niisutab intensiivselt",
      "Kaitseb naha barjääri",
      "Leevendab ebamugavustunnet"
    ],
    properties: [
      "Spetsiaalne jalgade hoolduskreem",
      "Sisaldab uureat ja sheavõid",
      "Sobib väga kuivale nahale",
      "Kiire imendumine",
      "100ml pakend"
    ],
    ingredients: "AQUA, UREA, GLYCERIN, BUTYROSPERMUM PARKII BUTTER, CETEARYL ALCOHOL, PARAFFINUM LIQUIDUM, DIMETHICONE, ALLANTOIN, TOCOPHERYL ACETATE, PHENOXYETHANOL, PARFUM."
  },
  // Dodici – Body Oil
  335137: {
    benefits: [
      "Sügav niisutus ja toitmine",
      "Muudab naha siidiselt siledaks",
      "Parandab naha elastsust",
      "Rahustab ja lõõgastab",
      "Imendub kiiresti"
    ],
    properties: [
      "100% looduslikud õlid",
      "Sisaldab jojobaõli ja magneesiumõli",
      "Sobib kõikidele nahatüüpidele",
      "Luksuslik lõhn",
      "Käsitsi valmistatud Eestis"
    ],
    ingredients: "SIMMONDSIA CHINENSIS SEED OIL, PRUNUS AMYGDALUS DULCIS OIL, MAGNESIUM CHLORIDE, TOCOPHEROL, PARFUM, LIMONENE, LINALOOL."
  }
};

// Brand color themes
const brandThemes: Record<string, { primary: string; secondary: string; accent: string; gradient: string }> = {
  collagenina: {
    primary: "from-rose-600 to-pink-500",
    secondary: "bg-rose-50 dark:bg-rose-950/30",
    accent: "text-rose-600 dark:text-rose-400",
    gradient: "from-rose-100 via-pink-50 to-white dark:from-rose-950/50 dark:via-pink-950/30 dark:to-background"
  },
  fillerina: {
    primary: "from-amber-600 to-yellow-500",
    secondary: "bg-amber-50 dark:bg-amber-950/30",
    accent: "text-amber-600 dark:text-amber-400",
    gradient: "from-amber-100 via-yellow-50 to-white dark:from-amber-950/50 dark:via-yellow-950/30 dark:to-background"
  },
  crescina: {
    primary: "from-emerald-600 to-teal-500",
    secondary: "bg-emerald-50 dark:bg-emerald-950/30",
    accent: "text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-100 via-teal-50 to-white dark:from-emerald-950/50 dark:via-teal-950/30 dark:to-background"
  },
  labo: {
    primary: "from-blue-600 to-cyan-500",
    secondary: "bg-blue-50 dark:bg-blue-950/30",
    accent: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-100 via-cyan-50 to-white dark:from-blue-950/50 dark:via-cyan-950/30 dark:to-background"
  },
  lpg: {
    primary: "from-violet-600 to-purple-500",
    secondary: "bg-violet-50 dark:bg-violet-950/30",
    accent: "text-violet-600 dark:text-violet-400",
    gradient: "from-violet-100 via-purple-50 to-white dark:from-violet-950/50 dark:via-purple-950/30 dark:to-background"
  },
  default: {
    primary: "from-primary to-primary/80",
    secondary: "bg-muted",
    accent: "text-primary",
    gradient: "from-muted via-background to-background"
  }
};

// Parse HTML description into categorized sections
const parseDescription = (html: string | null) => {
  if (!html) return { 
    properties: [], 
    usage: [], 
    ingredients: [], 
    ingredientsList: [],
    activeIngredients: [],
    general: [], 
    dayUsage: [], 
    nightUsage: [],
    additionalInfo: [],
    volume: '',
    benefits: []
  };
  
  // Remove HTML tags and clean up
  const cleanText = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/✔/g, '• ')
    .trim();
  
  const sections = {
    properties: [] as string[],
    usage: [] as string[],
    ingredients: [] as string[],
    ingredientsList: [] as { name: string; percentage?: string; description?: string }[],
    activeIngredients: [] as string[],
    general: [] as string[],
    dayUsage: [] as string[],
    nightUsage: [] as string[],
    additionalInfo: [] as string[],
    volume: '',
    benefits: [] as string[]
  };
  
  // Extract volume information
  const volumeMatch = cleanText.match(/kogus[:\s]*(\d+\s*(?:ml|g|pakikest)[^.]*)/i);
  if (volumeMatch) {
    sections.volume = volumeMatch[1].trim();
  }
  
  // Extract "Koostisosad:" section - only if it contains clear ingredient list with percentages
  const ingredientsSection = cleanText.match(/^koostisosad[:\s]*\n([\s\S]*?)(?=\n\n|kasutamine|tulemus\?|$)/im);
  if (ingredientsSection) {
    const ingredientLines = ingredientsSection[1].split(/\n/).filter(l => l.trim());
    // Only process if we find actual percentage patterns in the section
    const hasPercentages = ingredientLines.some(line => /\(\d+(?:[.,]\d+)?%?\)/.test(line));
    if (hasPercentages) {
      ingredientLines.forEach(line => {
        const trimmedLine = line.trim();
        // Only match very specific patterns like "Kollageen (80%) – description"
        // Must start with an ingredient name (capitalized word) followed by percentage
        const percentMatch = trimmedLine.match(/^([A-ZÄÖÜÕ][a-zäöüõ]+(?:\s+[a-zäöüõ]+)?)\s*\((\d+(?:[.,]\d+)?%?)\)\s*[–-]?\s*(.*)$/);
        if (percentMatch) {
          sections.ingredientsList.push({
            name: percentMatch[1].trim(),
            percentage: percentMatch[2].includes('%') ? percentMatch[2] : percentMatch[2] + '%',
            description: percentMatch[3].trim() || undefined
          });
        }
      });
    }
  }
  
  // Extract active ingredients from various patterns
  const ingredientPatterns = [
    /koostises[^.]*(?:on|sisaldab)[^.]*\(([^)]+)\)/gi,
    /sisaldab[^.]*\(([^)]+)\)/gi,
    /sisaldab\s+(?:ka\s+)?([^.,]+(?:,\s*[^.,]+)*)/gi
  ];
  
  ingredientPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(cleanText)) !== null) {
      if (match[1]) {
        const ingredients = match[1].split(/[,;]/).map(i => i.trim()).filter(i => i && i.length > 2);
        ingredients.forEach(ing => {
          // Clean up ingredient name
          const cleanIng = ing.replace(/\s+ekstrakt$/i, ' ekstrakt').trim();
          if (!sections.activeIngredients.includes(cleanIng) && cleanIng.length > 2) {
            sections.activeIngredients.push(cleanIng);
          }
        });
      }
    }
  });
  
  // Extract specific ingredient mentions with "ja" connector
  const ingredientMentions = cleanText.match(/(?:taimed|ekstraktid|koostisained)\s+([^.]+)/gi);
  if (ingredientMentions) {
    ingredientMentions.forEach(mention => {
      // Extract from parentheses
      const parenMatch = mention.match(/\(([^)]+)\)/);
      if (parenMatch) {
        const ings = parenMatch[1].split(/[,;]/).map(i => i.trim()).filter(i => i);
        ings.forEach(ing => {
          if (!sections.activeIngredients.includes(ing) && ing.length > 2) {
            sections.activeIngredients.push(ing);
          }
        });
      }
      // Also extract "ja X" patterns
      const andMatches = mention.match(/ja\s+([A-ZÄÖÜÕ][a-zäöüõA-ZÄÖÜÕ\s]+?)(?:[,.]|$)/g);
      if (andMatches) {
        andMatches.forEach(m => {
          const ing = m.replace(/^ja\s+/, '').replace(/[,.]$/, '').trim();
          if (!sections.activeIngredients.includes(ing) && ing.length > 2) {
            sections.activeIngredients.push(ing);
          }
        });
      }
    });
  }
  
  // Extract benefits (bullet points starting with •)
  const bulletPoints = cleanText.match(/[•✓]\s*[^•✓\n]+/g);
  if (bulletPoints) {
    bulletPoints.forEach(point => {
      const cleanPoint = point.replace(/^[•✓]\s*/, '').trim();
      if (cleanPoint.length > 5) {
        sections.benefits.push(cleanPoint);
      }
    });
  }
  
  // Check for day/night sections
  const hasDayNight = /päeval[\s:]/i.test(cleanText) && /öösel[\s:]/i.test(cleanText);
  
  if (hasDayNight) {
    // Split by day/night markers
    const parts = cleanText.split(/(päeval[\s:]*|öösel[\s:]*)/i);
    let currentSection: 'day' | 'night' | null = null;
    
    parts.forEach(part => {
      const trimmedPart = part.trim();
      if (!trimmedPart) return;
      
      if (/^päeval[\s:]*$/i.test(trimmedPart)) {
        currentSection = 'day';
      } else if (/^öösel[\s:]*$/i.test(trimmedPart)) {
        currentSection = 'night';
      } else if (currentSection === 'day') {
        const lines = trimmedPart.split(/\n+/).filter(l => l.trim());
        lines.forEach(line => {
          const cleanLine = line.trim();
          if (cleanLine && !cleanLine.toLowerCase().startsWith('selle tõhusust') && !cleanLine.toLowerCase().startsWith('kogus')) {
            sections.dayUsage.push(cleanLine);
          } else if (cleanLine.toLowerCase().startsWith('selle tõhusust')) {
            sections.additionalInfo.push(cleanLine);
          }
        });
      } else if (currentSection === 'night') {
        const lines = trimmedPart.split(/\n+/).filter(l => l.trim());
        lines.forEach(line => {
          const cleanLine = line.trim();
          if (cleanLine && !cleanLine.toLowerCase().startsWith('selle tõhusust') && !cleanLine.toLowerCase().startsWith('kogus')) {
            sections.nightUsage.push(cleanLine);
          } else if (cleanLine.toLowerCase().startsWith('selle tõhusust')) {
            sections.additionalInfo.push(cleanLine);
          }
        });
      } else {
        // Before any day/night section
        const lines = trimmedPart.split(/\n+/).filter(l => l.trim());
        lines.forEach(line => {
          const cleanLine = line.trim();
          if (cleanLine.toLowerCase().includes('kasutamine:') || cleanLine.toLowerCase().includes('soovitame kanda')) {
            sections.usage.push(cleanLine.replace(/kasutamine:\s*/i, '').trim());
          } else if (!cleanLine.toLowerCase().startsWith('kogus') && !cleanLine.toLowerCase().includes('koostisosad')) {
            sections.general.push(cleanLine);
          }
        });
      }
    });
  } else {
    // Original parsing without day/night structure
    const paragraphs = cleanText.split(/\n\n+/).filter(p => p.trim());
    
    paragraphs.forEach(para => {
      const lowerPara = para.toLowerCase();
      const trimmedPara = para.trim();
      
      if (lowerPara.startsWith('kogus') || lowerPara.startsWith('koostisosad:')) {
        return; // Skip, already processed
      }
      
      if (lowerPara.includes('kasutamine:') || lowerPara.includes('soovitame kanda') || lowerPara.includes('kandke') || lowerPara.includes('kanna ')) {
        sections.usage.push(trimmedPara.replace(/kasutamine:\s*/i, '').trim());
      } else if (lowerPara.includes('koostis') && !lowerPara.includes('koostisosad:')) {
        // Add to ingredients if not already processed
        if (!sections.ingredients.some(i => i.includes(trimmedPara.substring(0, 30)))) {
          sections.ingredients.push(trimmedPara);
        }
      } else if (lowerPara.includes('tase 2') || lowerPara.includes('tase 3') || lowerPara.includes('näidustatud')) {
        sections.usage.push(trimmedPara);
      } else if (lowerPara.includes('hoiatus') || lowerPara.includes('ettevaatust') || lowerPara.includes('säilitada') || lowerPara.includes('dermatoloogiliselt')) {
        sections.additionalInfo.push(trimmedPara);
      } else if (lowerPara.includes('toime') || lowerPara.includes('tulemus') || lowerPara.includes('miks valida')) {
        sections.properties.push(trimmedPara);
      } else {
        sections.general.push(trimmedPara);
      }
    });
  }
  
  // Parse usage from general if present
  sections.general = sections.general.filter(g => {
    if (g.toLowerCase().includes('kasutamine:') || g.toLowerCase().includes('soovitame kanda')) {
      sections.usage.push(g.replace(/kasutamine:\s*/i, '').trim());
      return false;
    }
    return true;
  });
  
  return sections;
};

// Detect brand from categories or name
const detectBrand = (categories: string[] | null, name: string): string => {
  const searchText = [...(categories || []), name].join(' ').toLowerCase();
  
  if (searchText.includes('collagenina')) return 'collagenina';
  if (searchText.includes('fillerina')) return 'fillerina';
  if (searchText.includes('crescina')) return 'crescina';
  if (searchText.includes('labo')) return 'labo';
  if (searchText.includes('lpg')) return 'lpg';
  
  return 'default';
};

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blisse_products')
        .select('*')
        .eq('id', parseInt(id || '0'))
        .single();
      
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id
  });

  const brand = useMemo(() => 
    product ? detectBrand(product.categories, product.name) : 'default', 
    [product]
  );
  
  const theme = brandThemes[brand] || brandThemes.default;
  const sections = useMemo(() => parseDescription(product?.description), [product?.description]);
  const customContent = product ? productCustomContent[product.id] : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Toodet ei leitud</h1>
          <Link to="/" className="text-primary hover:underline">
            Tagasi avalehele
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if product is in Kehahooldusseadmed category - use special device template
  const isDeviceCategory = product.categories?.some(cat => 
    cat.toLowerCase().includes('kehahooldusseadmed') || 
    cat.toLowerCase().includes('seadmed')
  );

  if (isDeviceCategory) {
    return (
      <>
        <Header />
        <ProductDeviceTemplate product={product} />
        <Footer />
      </>
    );
  }

  const currentPrice = product.sale_price && product.regular_price && product.sale_price < product.regular_price 
    ? product.sale_price 
    : (product.price || product.regular_price || 0);
  
  const isSale = !!(product.sale_price && product.regular_price && product.sale_price < product.regular_price);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Brand-themed hero gradient */}
      <div className={`absolute top-0 left-0 right-0 h-96 bg-gradient-to-b ${theme.gradient} -z-10`} />
      
      <main className="container px-4 py-8">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tagasi
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image - 40% smaller */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="w-[72%] relative">
              <div className={`aspect-square overflow-hidden rounded-2xl border-2 border-border/50 bg-white shadow-xl`}>
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              {isSale && (
                <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs px-2 py-0.5">
                  SOODUSTUS
                </Badge>
              )}
              {/* Brand badge */}
              <div className={`absolute top-3 right-3 bg-gradient-to-r ${theme.primary} text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg`}>
                {brand.charAt(0).toUpperCase() + brand.slice(1)}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.categories && product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {product.categories.map((cat, i) => (
                  <Badge key={i} variant="outline" className={`text-xs ${theme.accent} border-current`}>
                    {cat}
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                {currentPrice.toFixed(2)}€
              </span>
              {isSale && product.regular_price && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.regular_price.toFixed(2)}€
                </span>
              )}
            </div>

            {product.sku && (
              <p className="text-sm text-muted-foreground mb-6">
                Tootekood: {product.sku}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button 
                className="flex-1 bg-beauty-pink text-foreground border-0 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] hover:bg-beauty-pink/90"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Lisa ostukorvi
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 border-2"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart 
                  className={`h-6 w-6 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Description - Clean, elegant format without box - hide if customContent exists */}
        {!customContent && sections.general.length > 0 && (
          <div className="mt-12 mb-8">
            <div className="max-w-4xl">
              {/* Lühikirjeldus header */}
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Toote kirjeldus
              </h2>
              
              {sections.general.map((gen, i) => {
                // Format the description text with proper styling
                const formatDescription = (text: string) => {
                  // Split by double newlines to get paragraphs
                  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
                  
                  return paragraphs.map((para, pIdx) => {
                    const trimmedPara = para.trim();
                    
                    // Check if it's an ALL CAPS heading
                    if (trimmedPara.match(/^[A-ZÄÖÜÕ\s\-–]+$/) && trimmedPara.length < 80) {
                      return (
                        <h3 key={pIdx} className="text-xl font-bold text-foreground mt-8 mb-4 border-l-4 border-primary pl-4">
                          {trimmedPara}
                        </h3>
                      );
                    }
                    
                    // Check if it contains percentage stats (like "100% testis osalenutel")
                    if (trimmedPara.match(/\d+%\s+testis/i) || trimmedPara.match(/paranes\s+\d+/i)) {
                      return (
                        <div key={pIdx} className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 my-4 border-l-4 border-emerald-500">
                          <p className="text-base font-semibold text-emerald-700 dark:text-emerald-300">
                            {trimmedPara}
                          </p>
                        </div>
                      );
                    }
                    
                    // Check if it's age-related statistics (like "40. eluaastaks...")
                    if (trimmedPara.match(/^\d+\.\s*eluaasta/i)) {
                      return (
                        <div key={pIdx} className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 my-2 flex items-center gap-3">
                          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {trimmedPara.match(/^(\d+)/)?.[1]}+
                          </span>
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            {trimmedPara.replace(/^\d+\.\s*eluaasta[ks]*\s*/i, 'Eluaastaks ').trim()}
                          </p>
                        </div>
                      );
                    }
                    
                    // Check if it's a section title with dash (like "ETTEVALMISTUS –")
                    if (trimmedPara.match(/^[A-ZÄÖÜÕ\s]+\s*[–-]\s*$/)) {
                      return (
                        <h4 key={pIdx} className="text-lg font-bold text-foreground mt-6 mb-2">
                          {trimmedPara.replace(/[–-]\s*$/, '').trim()}
                        </h4>
                      );
                    }
                    
                    // Check if it's a subtitle/section header with description
                    if (trimmedPara.match(/^[A-ZÄÖÜÕ\s]+\s*[–-]\s*.+/)) {
                      const parts = trimmedPara.split(/[–-]/);
                      return (
                        <div key={pIdx} className="mt-6 mb-4">
                          <h4 className="text-lg font-bold text-foreground mb-1">
                            {parts[0].trim()}
                          </h4>
                          {parts[1] && (
                            <p className="text-sm text-primary font-medium uppercase tracking-wide">
                              {parts.slice(1).join(' – ').trim()}
                            </p>
                          )}
                        </div>
                      );
                    }
                    
                    // Highlight important numbers in regular paragraphs
                    const highlightNumbers = (text: string) => {
                      // Split by patterns to highlight
                      const parts = text.split(/(\d+(?:[.,]\d+)?%|\d+(?:-\d+)?%|\d+\.\s*eluaasta)/gi);
                      return parts.map((part, idx) => {
                        if (part.match(/\d+(?:[.,]\d+)?%|\d+(?:-\d+)?%/)) {
                          return <span key={idx} className="font-bold text-primary">{part}</span>;
                        }
                        if (part.match(/\d+\.\s*eluaasta/i)) {
                          return <span key={idx} className="font-semibold text-foreground">{part}</span>;
                        }
                        return part;
                      });
                    };
                    
                    // Regular paragraph
                    return (
                      <p key={pIdx} className="text-base text-muted-foreground leading-relaxed mb-4">
                        {highlightNumbers(trimmedPara)}
                      </p>
                    );
                  });
                };
                
                return (
                  <div key={i}>
                    {formatDescription(gen)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Categorized Content Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Custom: Miks kasutada (Why use) Section */}
          {customContent?.benefits && customContent.benefits.length > 0 && (
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Miks kasutada</h3>
              </div>
              <div className="space-y-3">
                {customContent.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-emerald-500" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom: Peamised omadused (Main Properties) Section */}
          {customContent?.properties && customContent.properties.length > 0 && (
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-beauty-pink flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Peamised omadused</h3>
              </div>
              <div className="space-y-3">
                {customContent.properties.map((prop, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-beauty-pink" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{prop}</p>
                  </div>
                ))}
              </div>
            </div>
          )}


          {customContent?.ingredients && (
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-border shadow-sm md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-400 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Millest koosneb</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {customContent.ingredients}
              </p>
            </div>
          )}
          {/* Day Usage Section */}
          {sections.dayUsage.length > 0 && (
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Päeval</h3>
              </div>
              <div className="space-y-3">
                {sections.dayUsage.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-amber-500" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Night Usage Section */}
          {sections.nightUsage.length > 0 && (
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Öösel</h3>
              </div>
              <div className="space-y-3">
                {sections.nightUsage.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-indigo-500" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Properties Section */}
          {sections.properties.length > 0 && (
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-beauty-pink flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Peamised omadused</h3>
              </div>
              <div className="space-y-3">
                {sections.properties.map((prop, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-beauty-pink" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{prop}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Usage Section */}
          {sections.usage.length > 0 && (
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-beauty-pink flex items-center justify-center">
                  <Users className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Kellele ja kuidas kasutada</h3>
              </div>
              <div className="space-y-3">
                {sections.usage.map((use, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">{use}</p>
                ))}
              </div>
            </div>
          )}

          {/* Active Ingredients Section (Koostisosad) - only show if no custom content */}
          {!customContent && (sections.activeIngredients.length > 0 || sections.ingredients.length > 0 || sections.ingredientsList.length > 0) && (
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Koostisosad</h3>
              </div>
              <div className="space-y-3">
                {sections.activeIngredients.map((ing, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-emerald-500" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{ing}</p>
                  </div>
                ))}
                {sections.ingredients.map((ing, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">{ing}</p>
                ))}
              </div>
            </div>
          )}
          
          {/* Benefits Section */}
          {sections.benefits.length > 0 && (
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-beauty-pink flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Miks see toode kasulik on?</h3>
              </div>
              <div className="space-y-2">
                {sections.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-beauty-pink" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info Section (Lisainfo) */}
          {sections.additionalInfo.length > 0 && (
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-400 flex items-center justify-center">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Lisainfo</h3>
              </div>
              <div className="space-y-3">
                {sections.additionalInfo.map((info, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-sky-500" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{info}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Volume/Size Info */}
          {sections.volume && (
            <div className="bg-white dark:bg-card rounded-2xl p-6 border-2 border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-beauty-pink flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Pakendi suurus</h3>
              </div>
              <p className="text-lg font-semibold text-foreground">{sections.volume}</p>
            </div>
          )}

        </div>

        {/* Related Products Section */}
        <RelatedProducts 
          currentProductId={product.id}
          categories={product.categories}
          brandName={brand}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Product;
