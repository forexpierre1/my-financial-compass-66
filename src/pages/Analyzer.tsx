import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Building,
  Globe,
  Users,
  Calendar,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  Banknote,
  Scale,
  Target,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  PieChart,
  Pie
} from "recharts";

type StockData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  enterpriseValue: number;
  peRatio: number;
  forwardPE: number;
  pegRatio: number;
  priceToBook: number;
  priceToSales: number;
  evToEbitda: number;
  evToRevenue: number;
  eps: number;
  epsGrowth: number;
  dividend: number;
  dividendYield: number;
  payoutRatio: number;
  week52High: number;
  week52Low: number;
  volume: number;
  avgVolume: number;
  beta: number;
  sector: string;
  industry: string;
  employees: number;
  description: string;
  founded: string;
  ceo: string;
  headquarters: string;
  // Advanced metrics
  revenue: number;
  revenueGrowth: number;
  revenueGrowth3Y: number;
  grossProfit: number;
  grossMargin: number;
  operatingIncome: number;
  operatingMargin: number;
  netIncome: number;
  netMargin: number;
  ebitda: number;
  ebitdaMargin: number;
  fcf: number;
  fcfMargin: number;
  fcfYield: number;
  fcfPerShare: number;
  operatingCashFlow: number;
  capex: number;
  // Debt metrics
  totalDebt: number;
  totalCash: number;
  netDebt: number;
  debtToEquity: number;
  debtToEbitda: number;
  interestCoverage: number;
  currentRatio: number;
  quickRatio: number;
  // Returns
  roe: number;
  roa: number;
  roic: number;
  // DCF
  dcfValue: number;
  dcfUpside: number;
  wacc: number;
  terminalGrowth: number;
};

type FinancialMetric = {
  label: string;
  value: string | number;
  description: string;
  status: "good" | "neutral" | "warning";
};

const generateMockData = (symbol: string): StockData => {
  const names: Record<string, string> = {
    AAPL: "Apple Inc.",
    MSFT: "Microsoft Corporation",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com Inc.",
    TSLA: "Tesla Inc.",
    META: "Meta Platforms Inc.",
    NVDA: "NVIDIA Corporation",
    BTC: "Bitcoin",
    ETH: "Ethereum",
  };

  const basePrice = Math.random() * 400 + 50;
  const change = (Math.random() - 0.5) * 20;
  const revenue = Math.floor(Math.random() * 300 + 50) * 1e9;
  const grossMargin = Math.random() * 0.3 + 0.3;
  const operatingMargin = Math.random() * 0.2 + 0.15;
  const netMargin = Math.random() * 0.15 + 0.1;
  const ebitdaMargin = Math.random() * 0.25 + 0.2;
  const fcfMargin = Math.random() * 0.15 + 0.1;
  const marketCap = Math.floor(Math.random() * 2000 + 100) * 1e9;

  return {
    symbol: symbol.toUpperCase(),
    name: names[symbol.toUpperCase()] || `${symbol.toUpperCase()} Corp.`,
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(((change / basePrice) * 100).toFixed(2)),
    marketCap: marketCap,
    enterpriseValue: marketCap * 1.1,
    peRatio: parseFloat((Math.random() * 40 + 10).toFixed(2)),
    forwardPE: parseFloat((Math.random() * 30 + 8).toFixed(2)),
    pegRatio: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
    priceToBook: parseFloat((Math.random() * 15 + 2).toFixed(2)),
    priceToSales: parseFloat((Math.random() * 10 + 1).toFixed(2)),
    evToEbitda: parseFloat((Math.random() * 20 + 8).toFixed(2)),
    evToRevenue: parseFloat((Math.random() * 8 + 2).toFixed(2)),
    eps: parseFloat((Math.random() * 15 + 1).toFixed(2)),
    epsGrowth: parseFloat((Math.random() * 40 - 10).toFixed(1)),
    dividend: parseFloat((Math.random() * 3).toFixed(2)),
    dividendYield: parseFloat((Math.random() * 4).toFixed(2)),
    payoutRatio: parseFloat((Math.random() * 50 + 10).toFixed(1)),
    week52High: parseFloat((basePrice * 1.3).toFixed(2)),
    week52Low: parseFloat((basePrice * 0.7).toFixed(2)),
    volume: Math.floor(Math.random() * 50000000 + 1000000),
    avgVolume: Math.floor(Math.random() * 40000000 + 800000),
    beta: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)),
    sector: "Technologie",
    industry: "Software & Services",
    employees: Math.floor(Math.random() * 150000 + 5000),
    description: "Une entreprise leader dans son secteur, offrant des produits et services innovants à une base mondiale de clients.",
    founded: "1976",
    ceo: "John Doe",
    headquarters: "Cupertino, CA",
    // Advanced metrics
    revenue: revenue,
    revenueGrowth: parseFloat((Math.random() * 30 - 5).toFixed(1)),
    revenueGrowth3Y: parseFloat((Math.random() * 25 + 5).toFixed(1)),
    grossProfit: revenue * grossMargin,
    grossMargin: parseFloat((grossMargin * 100).toFixed(1)),
    operatingIncome: revenue * operatingMargin,
    operatingMargin: parseFloat((operatingMargin * 100).toFixed(1)),
    netIncome: revenue * netMargin,
    netMargin: parseFloat((netMargin * 100).toFixed(1)),
    ebitda: revenue * ebitdaMargin,
    ebitdaMargin: parseFloat((ebitdaMargin * 100).toFixed(1)),
    fcf: revenue * fcfMargin,
    fcfMargin: parseFloat((fcfMargin * 100).toFixed(1)),
    fcfYield: parseFloat((Math.random() * 6 + 1).toFixed(2)),
    fcfPerShare: parseFloat((Math.random() * 20 + 2).toFixed(2)),
    operatingCashFlow: revenue * (fcfMargin + 0.05),
    capex: revenue * 0.05,
    // Debt metrics
    totalDebt: marketCap * (Math.random() * 0.4 + 0.1),
    totalCash: marketCap * (Math.random() * 0.2 + 0.05),
    netDebt: marketCap * (Math.random() * 0.3 - 0.05),
    debtToEquity: parseFloat((Math.random() * 1.5 + 0.2).toFixed(2)),
    debtToEbitda: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
    interestCoverage: parseFloat((Math.random() * 20 + 5).toFixed(1)),
    currentRatio: parseFloat((Math.random() * 2 + 0.8).toFixed(2)),
    quickRatio: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)),
    // Returns
    roe: parseFloat((Math.random() * 40 + 10).toFixed(1)),
    roa: parseFloat((Math.random() * 20 + 5).toFixed(1)),
    roic: parseFloat((Math.random() * 30 + 8).toFixed(1)),
    // DCF
    dcfValue: parseFloat((basePrice * (1 + Math.random() * 0.4 - 0.1)).toFixed(2)),
    dcfUpside: parseFloat((Math.random() * 40 - 10).toFixed(1)),
    wacc: parseFloat((Math.random() * 4 + 7).toFixed(1)),
    terminalGrowth: parseFloat((Math.random() * 1.5 + 2).toFixed(1)),
  };
};

const generatePriceHistory = () => {
  const data = [];
  let price = 150;
  for (let i = 30; i >= 0; i--) {
    price += (Math.random() - 0.48) * 5;
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};

const generateVolumeData = () => {
  return Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    volume: Math.floor(Math.random() * 50000000 + 10000000),
  }));
};

const generateRevenueHistory = () => {
  const years = ['2020', '2021', '2022', '2023', '2024'];
  let revenue = 200;
  return years.map(year => {
    revenue = revenue * (1 + Math.random() * 0.2);
    const netIncome = revenue * (0.15 + Math.random() * 0.1);
    const fcf = revenue * (0.12 + Math.random() * 0.08);
    return {
      year,
      revenue: parseFloat(revenue.toFixed(1)),
      netIncome: parseFloat(netIncome.toFixed(1)),
      fcf: parseFloat(fcf.toFixed(1)),
    };
  });
};

const generateMarginHistory = () => {
  const years = ['2020', '2021', '2022', '2023', '2024'];
  return years.map(year => ({
    year,
    grossMargin: parseFloat((40 + Math.random() * 10).toFixed(1)),
    operatingMargin: parseFloat((25 + Math.random() * 8).toFixed(1)),
    netMargin: parseFloat((18 + Math.random() * 6).toFixed(1)),
  }));
};

export default function Analyzer() {
  const [searchParams] = useSearchParams();
  const initialSymbol = searchParams.get("symbol") || "";
  
  const [searchSymbol, setSearchSymbol] = useState(initialSymbol);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [revenueHistory, setRevenueHistory] = useState<any[]>([]);
  const [marginHistory, setMarginHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialSymbol) {
      handleSearch();
    }
  }, []);

  const handleSearch = () => {
    if (!searchSymbol.trim()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setStockData(generateMockData(searchSymbol));
      setPriceHistory(generatePriceHistory());
      setVolumeData(generateVolumeData());
      setRevenueHistory(generateRevenueHistory());
      setMarginHistory(generateMarginHistory());
      setIsLoading(false);
    }, 800);
  };

  const getQuickMetrics = (data: StockData): FinancialMetric[] => [
    {
      label: "P/E Ratio",
      value: data.peRatio,
      description: "Ratio cours/bénéfice",
      status: data.peRatio < 20 ? "good" : data.peRatio < 35 ? "neutral" : "warning",
    },
    {
      label: "FCF Yield",
      value: `${data.fcfYield}%`,
      description: "Rendement du FCF",
      status: data.fcfYield > 4 ? "good" : data.fcfYield > 2 ? "neutral" : "warning",
    },
    {
      label: "ROIC",
      value: `${data.roic}%`,
      description: "Retour sur capital investi",
      status: data.roic > 15 ? "good" : data.roic > 10 ? "neutral" : "warning",
    },
    {
      label: "Croissance CA",
      value: `${data.revenueGrowth > 0 ? "+" : ""}${data.revenueGrowth}%`,
      description: "Croissance du chiffre d'affaires",
      status: data.revenueGrowth > 10 ? "good" : data.revenueGrowth > 0 ? "neutral" : "warning",
    },
  ];

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T €`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B €`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M €`;
    return `${value.toLocaleString()} €`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toString();
  };

  const MetricRow = ({ label, value, tooltip }: { label: string; value: string | number; tooltip?: string }) => (
    <div className="flex justify-between py-2 border-b border-border last:border-b-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  const StatusBadge = ({ value, thresholds }: { value: number; thresholds: { good: number; warning: number; reverse?: boolean } }) => {
    const isGood = thresholds.reverse ? value < thresholds.good : value > thresholds.good;
    const isWarning = thresholds.reverse ? value > thresholds.warning : value < thresholds.warning;
    
    return (
      <Badge variant={isGood ? "default" : isWarning ? "destructive" : "secondary"} className={cn(
        isGood && "bg-success text-success-foreground",
      )}>
        {value}
      </Badge>
    );
  };

  return (
    <DashboardLayout title="Analyseur d'Actions">
      <div className="space-y-6">
        {/* Header & Search */}
        <div className="space-y-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Analyseur d'Actions</h1>
            <p className="text-muted-foreground">Analyse fondamentale complète</p>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Entrez un symbole (ex: AAPL, MSFT, GOOGL...)"
                    value={searchSymbol}
                    onChange={(e) => setSearchSymbol(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? "Chargement..." : "Analyser"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Analysis Results */}
        {stockData && (
          <div className="space-y-6">
            {/* Stock Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="font-display font-bold text-xl text-primary">
                        {stockData.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="font-display text-2xl font-bold">{stockData.symbol}</h2>
                        <Badge variant="secondary">{stockData.sector}</Badge>
                      </div>
                      <p className="text-muted-foreground">{stockData.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl font-bold">
                      {stockData.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </p>
                    <div className={cn(
                      "flex items-center justify-end gap-2 text-lg",
                      stockData.change >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {stockData.change >= 0 ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5" />
                      )}
                      <span>
                        {stockData.change >= 0 ? "+" : ""}{stockData.change.toFixed(2)}€ ({stockData.changePercent}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DCF Summary Card */}
            <Card className={cn(
              "border-2",
              stockData.dcfUpside > 10 ? "border-success/50 bg-success/5" : 
              stockData.dcfUpside < -10 ? "border-destructive/50 bg-destructive/5" : "border-border"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center",
                      stockData.dcfUpside > 10 ? "bg-success/20" : 
                      stockData.dcfUpside < -10 ? "bg-destructive/20" : "bg-primary/20"
                    )}>
                      <Calculator className={cn(
                        "h-6 w-6",
                        stockData.dcfUpside > 10 ? "text-success" : 
                        stockData.dcfUpside < -10 ? "text-destructive" : "text-primary"
                      )} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valeur intrinsèque (DCF)</p>
                      <p className="font-display text-2xl font-bold">{stockData.dcfValue}€</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Potentiel</p>
                    <p className={cn(
                      "font-display text-2xl font-bold",
                      stockData.dcfUpside > 0 ? "text-success" : "text-destructive"
                    )}>
                      {stockData.dcfUpside > 0 ? "+" : ""}{stockData.dcfUpside}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">WACC</p>
                    <p className="font-medium">{stockData.wacc}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Croissance terminale</p>
                    <p className="font-medium">{stockData.terminalGrowth}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-secondary flex-wrap h-auto gap-1">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="valuation">Valorisation</TabsTrigger>
                <TabsTrigger value="growth">Croissance</TabsTrigger>
                <TabsTrigger value="margins">Marges & FCF</TabsTrigger>
                <TabsTrigger value="debt">Dette & Santé</TabsTrigger>
                <TabsTrigger value="charts">Graphiques</TabsTrigger>
                <TabsTrigger value="company">Entreprise</TabsTrigger>
              </TabsList>

              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getQuickMetrics(stockData).map((metric, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm text-muted-foreground">{metric.label}</span>
                          {metric.status === "good" && <CheckCircle className="h-4 w-4 text-success" />}
                          {metric.status === "warning" && <AlertTriangle className="h-4 w-4 text-warning" />}
                          {metric.status === "neutral" && <Info className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <p className="font-display text-xl font-bold">{metric.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Évolution du cours (30 jours)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={priceHistory}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="hsl(var(--primary))" 
                            fillOpacity={1} 
                            fill="url(#colorPrice)" 
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Capitalisation</p>
                      <p className="font-display text-lg font-bold">{formatLargeNumber(stockData.marketCap)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Volume</p>
                      <p className="font-display text-lg font-bold">{formatVolume(stockData.volume)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Plus haut 52 sem.</p>
                      <p className="font-display text-lg font-bold">{stockData.week52High}€</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Plus bas 52 sem.</p>
                      <p className="font-display text-lg font-bold">{stockData.week52Low}€</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* VALUATION TAB */}
              <TabsContent value="valuation" className="space-y-6">
                {/* Valuation Multiples Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Multiples de valorisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[
                            { name: "P/E", value: stockData.peRatio, benchmark: 25 },
                            { name: "Forward P/E", value: stockData.forwardPE, benchmark: 20 },
                            { name: "PEG", value: stockData.pegRatio, benchmark: 1.5 },
                            { name: "P/B", value: stockData.priceToBook, benchmark: 3 },
                            { name: "P/S", value: stockData.priceToSales, benchmark: 5 },
                            { name: "EV/EBITDA", value: stockData.evToEbitda, benchmark: 15 },
                          ]}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="value" name="Actuel" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="benchmark" name="Benchmark" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* DCF Visual */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        DCF Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={[
                              { name: "Prix actuel", value: stockData.price },
                              { name: "Valeur DCF", value: stockData.dcfValue },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                              formatter={(value: number) => [`${value}€`, '']}
                            />
                            <Bar 
                              dataKey="value" 
                              radius={[4, 4, 0, 0]}
                              fill={stockData.dcfUpside > 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">Potentiel</p>
                        <p className={cn(
                          "text-2xl font-bold",
                          stockData.dcfUpside > 0 ? "text-success" : "text-destructive"
                        )}>
                          {stockData.dcfUpside > 0 ? "+" : ""}{stockData.dcfUpside}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 52-Week Range Visual */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Position dans le range 52 semaines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={[
                              { name: "Plus bas", value: stockData.week52Low },
                              { name: "Actuel", value: stockData.price },
                              { name: "Plus haut", value: stockData.week52High },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                              formatter={(value: number) => [`${value}€`, '']}
                            />
                            <Bar 
                              dataKey="value" 
                              radius={[4, 4, 0, 0]}
                            >
                              <Cell fill="hsl(var(--destructive))" />
                              <Cell fill="hsl(var(--primary))" />
                              <Cell fill="hsl(var(--success))" />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Dividends Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      Rendement & Dividendes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[
                            { name: "Dividende", value: stockData.dividend, unit: "€" },
                            { name: "Rendement", value: stockData.dividendYield, unit: "%" },
                            { name: "Payout Ratio", value: stockData.payoutRatio, unit: "%" },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="value" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* GROWTH TAB */}
              <TabsContent value="growth" className="space-y-6">
                {/* Growth Metrics Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Taux de croissance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[
                            { name: "CA (YoY)", value: stockData.revenueGrowth },
                            { name: "CA (3Y CAGR)", value: stockData.revenueGrowth3Y },
                            { name: "EPS (YoY)", value: stockData.epsGrowth },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}%`} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${value}%`, 'Croissance']}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {[stockData.revenueGrowth, stockData.revenueGrowth3Y, stockData.epsGrowth].map((val, i) => (
                              <Cell key={i} fill={val >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Returns Radar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Rentabilité (Returns)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={[
                            { metric: "ROE", value: stockData.roe, fullMark: 50 },
                            { metric: "ROA", value: stockData.roa, fullMark: 50 },
                            { metric: "ROIC", value: stockData.roic, fullMark: 50 },
                          ]}>
                            <PolarGrid stroke="hsl(var(--border))" />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 50]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                            <Radar name="Returns" dataKey="value" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.5} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Returns Bar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparaison des returns (%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={[
                              { name: "ROE", value: stockData.roe, benchmark: 15 },
                              { name: "ROA", value: stockData.roa, benchmark: 8 },
                              { name: "ROIC", value: stockData.roic, benchmark: 12 },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="value" name="Actuel" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="benchmark" name="Benchmark" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Revenue History Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution CA, Résultat Net & FCF (en B€)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={revenueHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="revenue" name="Chiffre d'affaires" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          <Line type="monotone" dataKey="netIncome" name="Résultat Net" stroke="hsl(var(--success))" strokeWidth={2} />
                          <Line type="monotone" dataKey="fcf" name="Free Cash Flow" stroke="hsl(var(--warning))" strokeWidth={2} strokeDasharray="5 5" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* MARGINS & FCF TAB */}
              <TabsContent value="margins" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Margins Radar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Percent className="h-5 w-5" />
                        Marges (%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={[
                            { metric: "Brute", value: stockData.grossMargin, fullMark: 100 },
                            { metric: "Opér.", value: stockData.operatingMargin, fullMark: 100 },
                            { metric: "EBITDA", value: stockData.ebitdaMargin, fullMark: 100 },
                            { metric: "Nette", value: stockData.netMargin, fullMark: 100 },
                            { metric: "FCF", value: stockData.fcfMargin, fullMark: 100 },
                          ]}>
                            <PolarGrid stroke="hsl(var(--border))" />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                            <Radar name="Marges" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Margins Bar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Évolution des marges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={marginHistory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="grossMargin" name="M. Brute" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="operatingMargin" name="M. Opér." fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="netMargin" name="M. Nette" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* FCF Analysis Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      Free Cash Flow Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[
                            { name: "Op. Cash Flow", value: stockData.operatingCashFlow / 1e9 },
                            { name: "CapEx", value: -stockData.capex / 1e9 },
                            { name: "FCF", value: stockData.fcf / 1e9 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}B`} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${value.toFixed(2)}B €`, '']}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            <Cell fill="hsl(var(--primary))" />
                            <Cell fill="hsl(var(--destructive))" />
                            <Cell fill="hsl(var(--success))" />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Income Statement Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Compte de résultat (B€)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          layout="vertical"
                          data={[
                            { name: "CA", value: stockData.revenue / 1e9 },
                            { name: "Rés. Brut", value: stockData.grossProfit / 1e9 },
                            { name: "Rés. Opér.", value: stockData.operatingIncome / 1e9 },
                            { name: "EBITDA", value: stockData.ebitda / 1e9 },
                            { name: "Rés. Net", value: stockData.netIncome / 1e9 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}B`} />
                          <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${value.toFixed(2)}B €`, '']}
                          />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CHARTS TAB */}
              <TabsContent value="charts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique du cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Volume quotidien</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={volumeData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatVolume} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [formatVolume(value), "Volume"]}
                          />
                          <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* COMPANY TAB */}
              <TabsContent value="company" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de {stockData.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{stockData.description}</p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations clés</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 py-2 border-b border-border">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Secteur</span>
                        <span className="ml-auto font-medium">{stockData.sector}</span>
                      </div>
                      <div className="flex items-center gap-3 py-2 border-b border-border">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Industrie</span>
                        <span className="ml-auto font-medium">{stockData.industry}</span>
                      </div>
                      <div className="flex items-center gap-3 py-2 border-b border-border">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Siège</span>
                        <span className="ml-auto font-medium">{stockData.headquarters}</span>
                      </div>
                      <div className="flex items-center gap-3 py-2 border-b border-border">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Fondée en</span>
                        <span className="ml-auto font-medium">{stockData.founded}</span>
                      </div>
                      <div className="flex items-center gap-3 py-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Employés</span>
                        <span className="ml-auto font-medium">{stockData.employees.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Direction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{stockData.ceo}</p>
                          <p className="text-sm text-muted-foreground">CEO</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {!stockData && !isLoading && (
          <Card className="text-center py-16">
            <CardContent>
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="font-display text-xl font-semibold mb-2">Recherchez une action</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Entrez le symbole d'une action pour accéder à une analyse fondamentale complète : 
                DCF, FCF, marges, croissance, dette, et plus encore.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
