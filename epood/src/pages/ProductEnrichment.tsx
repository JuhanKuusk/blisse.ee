import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Play, CheckCircle, XCircle, AlertCircle, RefreshCw, Image as ImageIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface EnrichmentResult {
  id: number;
  name: string;
  status: string;
  shortDescription?: string;
  ingredientsCount?: number;
  hasInci?: boolean;
  reason?: string;
  error?: string;
}

interface ImageEnrichmentResult {
  productId: number;
  name: string;
  status: string;
  imagesFound?: number;
  error?: string;
}

interface BatchResult {
  success: boolean;
  processed: number;
  totalProducts: number;
  nextOffset: number;
  hasMore: boolean;
  results: EnrichmentResult[];
}

interface ImageBatchResult {
  success: boolean;
  processed: number;
  total: number;
  hasMore: boolean;
  results: ImageEnrichmentResult[];
}

const ProductEnrichment = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [results, setResults] = useState<EnrichmentResult[]>([]);
  const [batchSize] = useState(5);

  // Image enrichment state
  const [isImageRunning, setIsImageRunning] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [imageOffset, setImageOffset] = useState(0);
  const [imageTotalProducts, setImageTotalProducts] = useState(0);
  const [imageResults, setImageResults] = useState<ImageEnrichmentResult[]>([]);

  const runEnrichment = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    setCurrentOffset(0);

    let offset = 0;
    let hasMore = true;
    let allResults: EnrichmentResult[] = [];

    try {
      while (hasMore) {
        toast.info(`Töötlen partiid: ${offset} - ${offset + batchSize}...`);
        
        const { data, error } = await supabase.functions.invoke<BatchResult>('enrich-all-products', {
          body: { limit: batchSize, offset }
        });

        if (error) {
          console.error('Enrichment error:', error);
          toast.error(`Viga partii töötlemisel: ${error.message}`);
          break;
        }

        if (data) {
          setTotalProducts(data.totalProducts);
          allResults = [...allResults, ...data.results];
          setResults([...allResults]);
          setCurrentOffset(data.nextOffset);
          
          const newProgress = Math.min((data.nextOffset / data.totalProducts) * 100, 100);
          setProgress(newProgress);
          
          hasMore = data.hasMore;
          offset = data.nextOffset;

          const enrichedCount = data.results.filter(r => r.status === 'enriched').length;
          if (enrichedCount > 0) {
            toast.success(`${enrichedCount} toodet rikastatud!`);
          }

          // Pause between batches to avoid rate limits
          if (hasMore) {
            await new Promise(r => setTimeout(r, 3000));
          }
        } else {
          break;
        }
      }

      toast.success('Tooteinfo rikastamine lõpetatud!');
    } catch (err) {
      console.error('Enrichment failed:', err);
      toast.error('Rikastamine ebaõnnestus');
    } finally {
      setIsRunning(false);
    }
  };

  const runSingleBatch = async () => {
    setIsRunning(true);

    try {
      toast.info(`Töötlen partiid: ${currentOffset} - ${currentOffset + batchSize}...`);
      
      const { data, error } = await supabase.functions.invoke<BatchResult>('enrich-all-products', {
        body: { limit: batchSize, offset: currentOffset }
      });

      if (error) {
        toast.error(`Viga: ${error.message}`);
        return;
      }

      if (data) {
        setTotalProducts(data.totalProducts);
        setResults(prev => [...prev, ...data.results]);
        setCurrentOffset(data.nextOffset);
        
        const newProgress = Math.min((data.nextOffset / data.totalProducts) * 100, 100);
        setProgress(newProgress);

        const enrichedCount = data.results.filter(r => r.status === 'enriched').length;
        toast.success(`Partii töödeldud! ${enrichedCount} toodet rikastatud.`);
      }
    } catch (err) {
      toast.error('Partii töötlemine ebaõnnestus');
    } finally {
      setIsRunning(false);
    }
  };

  // Image enrichment functions
  const runImageEnrichment = async () => {
    setIsImageRunning(true);
    setImageProgress(0);
    setImageResults([]);
    setImageOffset(0);

    let offset = 0;
    let hasMore = true;
    let allResults: ImageEnrichmentResult[] = [];

    try {
      while (hasMore) {
        toast.info(`Töötlen pilte: ${offset} - ${offset + batchSize}...`);
        
        const { data, error } = await supabase.functions.invoke<ImageBatchResult>('enrich-product-images', {
          body: { limit: batchSize, offset }
        });

        if (error) {
          console.error('Image enrichment error:', error);
          toast.error(`Viga piltide töötlemisel: ${error.message}`);
          break;
        }

        if (data) {
          setImageTotalProducts(data.total || 0);
          allResults = [...allResults, ...data.results];
          setImageResults([...allResults]);
          
          const newOffset = offset + data.processed;
          setImageOffset(newOffset);
          
          const newProgress = data.total ? Math.min((newOffset / data.total) * 100, 100) : 0;
          setImageProgress(newProgress);
          
          hasMore = data.hasMore;
          offset = newOffset;

          const enrichedCount = data.results.filter(r => r.status === 'enriched').length;
          if (enrichedCount > 0) {
            toast.success(`${enrichedCount} toote pildid uuendatud!`);
          }

          // Pause between batches to avoid rate limits
          if (hasMore) {
            await new Promise(r => setTimeout(r, 3000));
          }
        } else {
          break;
        }
      }

      toast.success('Piltide rikastamine lõpetatud!');
    } catch (err) {
      console.error('Image enrichment failed:', err);
      toast.error('Piltide rikastamine ebaõnnestus');
    } finally {
      setIsImageRunning(false);
    }
  };

  const runSingleImageBatch = async () => {
    setIsImageRunning(true);

    try {
      toast.info(`Töötlen pilte: ${imageOffset} - ${imageOffset + batchSize}...`);
      
      const { data, error } = await supabase.functions.invoke<ImageBatchResult>('enrich-product-images', {
        body: { limit: batchSize, offset: imageOffset }
      });

      if (error) {
        toast.error(`Viga: ${error.message}`);
        return;
      }

      if (data) {
        setImageTotalProducts(data.total || 0);
        setImageResults(prev => [...prev, ...data.results]);
        
        const newOffset = imageOffset + data.processed;
        setImageOffset(newOffset);
        
        const newProgress = data.total ? Math.min((newOffset / data.total) * 100, 100) : 0;
        setImageProgress(newProgress);

        const enrichedCount = data.results.filter(r => r.status === 'enriched').length;
        toast.success(`Partii töödeldud! ${enrichedCount} toote pildid uuendatud.`);
      }
    } catch (err) {
      toast.error('Piltide partii töötlemine ebaõnnestus');
    } finally {
      setIsImageRunning(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enriched':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Rikastatud</Badge>;
      case 'skipped':
        return <Badge variant="secondary">Vahele jäetud</Badge>;
      case 'no_results':
      case 'no_images':
        return <Badge variant="outline">Tulemusi pole</Badge>;
      case 'no_new_data':
      case 'no_metadata':
        return <Badge variant="outline">Uut infot pole</Badge>;
      case 'rate_limited':
        return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" />Rate limit</Badge>;
      case 'wc_update_failed':
        return <Badge className="bg-orange-500"><AlertCircle className="w-3 h-3 mr-1" />WC viga</Badge>;
      case 'error':
      case 'ai_error':
      case 'update_error':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Viga</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const stats = {
    enriched: results.filter(r => r.status === 'enriched').length,
    skipped: results.filter(r => r.status === 'skipped').length,
    noResults: results.filter(r => r.status === 'no_results' || r.status === 'no_new_data').length,
    errors: results.filter(r => ['error', 'ai_error', 'update_error'].includes(r.status)).length,
  };

  const imageStats = {
    enriched: imageResults.filter(r => r.status === 'enriched').length,
    noResults: imageResults.filter(r => ['no_results', 'no_images', 'no_metadata'].includes(r.status)).length,
    errors: imageResults.filter(r => ['error', 'wc_update_failed'].includes(r.status)).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tooteinfo rikastamine</h1>
        
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Sisu rikastamine</TabsTrigger>
            <TabsTrigger value="images">Piltide rikastamine</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automaatne rikastamine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    See funktsioon otsib veebist iga toote kohta koostisosade infot, INCI nimekirja ja kirjeldusi ning lisab need automaatselt andmebaasi.
                  </p>
                  
                  <div className="flex gap-3">
                    <Button onClick={runEnrichment} disabled={isRunning}>
                      {isRunning ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Töötlen...</>
                      ) : (
                        <><Play className="w-4 h-4 mr-2" />Käivita kõik</>
                      )}
                    </Button>
                    
                    <Button variant="outline" onClick={runSingleBatch} disabled={isRunning}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Järgmine partii ({currentOffset}-{currentOffset + batchSize})
                    </Button>
                  </div>

                  {totalProducts > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{currentOffset} / {totalProducts}</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistika</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.enriched}</div>
                      <div className="text-sm text-muted-foreground">Rikastatud</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">{stats.skipped}</div>
                      <div className="text-sm text-muted-foreground">Vahele jäetud</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.noResults}</div>
                      <div className="text-sm text-muted-foreground">Tulemusi pole</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                      <div className="text-sm text-muted-foreground">Vead</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tulemused ({results.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {results.map((result, i) => (
                      <div key={`${result.id}-${i}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{result.name}</div>
                          {result.shortDescription && (
                            <div className="text-sm text-muted-foreground">{result.shortDescription}</div>
                          )}
                          {result.ingredientsCount !== undefined && (
                            <div className="text-xs text-muted-foreground">
                              {result.ingredientsCount} koostisosa • INCI: {result.hasInci ? 'Jah' : 'Ei'}
                            </div>
                          )}
                          {result.reason && (
                            <div className="text-xs text-muted-foreground">{result.reason}</div>
                          )}
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Piltide rikastamine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    See funktsioon otsib veebist kvaliteetseid tootepilte, genereerib eestikeelsed nimed ja alt-tekstid ning uuendab need otse WooCommerce andmebaasis.
                  </p>
                  
                  <div className="flex gap-3">
                    <Button onClick={runImageEnrichment} disabled={isImageRunning}>
                      {isImageRunning ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Töötlen...</>
                      ) : (
                        <><Play className="w-4 h-4 mr-2" />Käivita kõik</>
                      )}
                    </Button>
                    
                    <Button variant="outline" onClick={runSingleImageBatch} disabled={isImageRunning}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Järgmine partii ({imageOffset}-{imageOffset + batchSize})
                    </Button>
                  </div>

                  {imageTotalProducts > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{imageOffset} / {imageTotalProducts}</span>
                      </div>
                      <Progress value={imageProgress} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Piltide statistika</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{imageStats.enriched}</div>
                      <div className="text-sm text-muted-foreground">Uuendatud</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{imageStats.noResults}</div>
                      <div className="text-sm text-muted-foreground">Pilte pole</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{imageStats.errors}</div>
                      <div className="text-sm text-muted-foreground">Vead</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {imageResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Piltide tulemused ({imageResults.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {imageResults.map((result, i) => (
                      <div key={`img-${result.productId}-${i}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{result.name}</div>
                          {result.imagesFound !== undefined && result.imagesFound > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {result.imagesFound} pilti leitud ja lisatud
                            </div>
                          )}
                          {result.error && (
                            <div className="text-xs text-red-500">{result.error}</div>
                          )}
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ProductEnrichment;
