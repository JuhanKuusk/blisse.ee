import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductSyncPage from "./pages/ProductSync";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Brand from "./pages/Brand";
import ProductEnrichment from "./pages/ProductEnrichment";
import ImageRebranding from "./pages/ImageRebranding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sync" element={<ProductSyncPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/toode/:id" element={<Product />} />
          <Route path="/kategooria/:slug" element={<Category />} />
          <Route path="/brand/:slug" element={<Brand />} />
          <Route path="/admin/enrich" element={<ProductEnrichment />} />
          <Route path="/admin/rebranding" element={<ImageRebranding />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
