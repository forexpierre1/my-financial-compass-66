import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Objectives from "./pages/Objectives";
import Budget from "./pages/Budget";
import Portfolio from "./pages/Portfolio";
import Patrimony from "./pages/Patrimony";
import Settings from "./pages/Settings";
import Watchlist from "./pages/Watchlist";
import Analyzer from "./pages/Analyzer";
import Screener from "./pages/Screener";
import Comparator from "./pages/Comparator";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/patrimony" element={<Patrimony />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/screener" element={<Screener />} />
          <Route path="/comparator" element={<Comparator />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
