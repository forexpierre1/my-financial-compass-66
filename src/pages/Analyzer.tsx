import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart3,
  PieChart,
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
  ArrowDownRight
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
  Bar
} from "recharts";

type StockData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  dividend: number;
  dividendYield: number;
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

  return {
    symbol: symbol.toUpperCase(),
    name: names[symbol.toUpperCase()] || `${symbol.toUpperCase()} Corp.`,
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(((change / basePrice) * 100).toFixed(2)),
    marketCap: Math.floor(Math.random() * 2000 + 100) * 1e9,
    peRatio: parseFloat((Math.random() * 40 + 10).toFixed(2)),
    eps: parseFloat((Math.random() * 15 + 1).toFixed(2)),
    dividend: parseFloat((Math.random() * 3).toFixed(2)),
    dividendYield: parseFloat((Math.random() * 4).toFixed(2)),
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

export default function Analyzer() {
  const [searchParams] = useSearchParams();
  const initialSymbol = searchParams.get("symbol") || "";
  
  const [searchSymbol, setSearchSymbol] = useState(initialSymbol);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialSymbol) {
      handleSearch();
    }
  }, []);

  const handleSearch = () => {
    if (!searchSymbol.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setStockData(generateMockData(searchSymbol));
      setPriceHistory(generatePriceHistory());
      setVolumeData(generateVolumeData());
      setIsLoading(false);
    }, 800);
  };

  const getMetrics = (data: StockData): FinancialMetric[] => [
    {
      label: "P/E Ratio",
      value: data.peRatio,
      description: "Ratio cours/bénéfice",
      status: data.peRatio < 20 ? "good" : data.peRatio < 35 ? "neutral" : "warning",
    },
    {
      label: "EPS",
      value: `${data.eps}€`,
      description: "Bénéfice par action",
      status: data.eps > 5 ? "good" : data.eps > 2 ? "neutral" : "warning",
    },
    {
      label: "Beta",
      value: data.beta,
      description: "Volatilité par rapport au marché",
      status: data.beta < 1 ? "good" : data.beta < 1.5 ? "neutral" : "warning",
    },
    {
      label: "Dividende",
      value: `${data.dividendYield}%`,
      description: "Rendement du dividende",
      status: data.dividendYield > 2 ? "good" : data.dividendYield > 0 ? "neutral" : "warning",
    },
  ];

  const formatMarketCap = (value: number) => {
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

  return (
    <DashboardLayout title="Analyseur d'Actions">
      <div className="space-y-6">
        {/* Header & Search */}
        <div className="space-y-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Analyseur d'Actions</h1>
            <p className="text-muted-foreground">Analysez en détail n'importe quelle action</p>
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
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="font-display font-bold text-xl text-primary">
                        {stockData.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
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

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-secondary">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="financials">Métriques</TabsTrigger>
                <TabsTrigger value="chart">Graphiques</TabsTrigger>
                <TabsTrigger value="company">Entreprise</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getMetrics(stockData).map((metric, index) => (
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

                {/* Price Chart */}
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

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Capitalisation</p>
                      <p className="font-display text-lg font-bold">{formatMarketCap(stockData.marketCap)}</p>
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

              <TabsContent value="financials" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Valorisation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">P/E Ratio</span>
                        <span className="font-medium">{stockData.peRatio}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">EPS (TTM)</span>
                        <span className="font-medium">{stockData.eps}€</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Market Cap</span>
                        <span className="font-medium">{formatMarketCap(stockData.marketCap)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Beta</span>
                        <span className="font-medium">{stockData.beta}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dividendes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Dividende annuel</span>
                        <span className="font-medium">{stockData.dividend}€</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Rendement</span>
                        <span className="font-medium">{stockData.dividendYield}%</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Payout Ratio</span>
                        <span className="font-medium">~35%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Volume & Liquidité</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Volume du jour</span>
                        <span className="font-medium">{formatVolume(stockData.volume)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Volume moyen (3 mois)</span>
                        <span className="font-medium">{formatVolume(stockData.avgVolume)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Ratio volume</span>
                        <span className="font-medium">{(stockData.volume / stockData.avgVolume).toFixed(2)}x</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Range 52 semaines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{stockData.week52Low}€</span>
                          <span className="text-muted-foreground">{stockData.week52High}€</span>
                        </div>
                        <div className="relative h-2 bg-secondary rounded-full">
                          <div 
                            className="absolute h-full bg-primary rounded-full"
                            style={{ 
                              width: `${((stockData.price - stockData.week52Low) / (stockData.week52High - stockData.week52Low)) * 100}%` 
                            }}
                          />
                          <div 
                            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-primary rounded-full border-2 border-background"
                            style={{ 
                              left: `${((stockData.price - stockData.week52Low) / (stockData.week52High - stockData.week52Low)) * 100}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                        </div>
                        <p className="text-center text-sm">
                          Prix actuel: <span className="font-bold">{stockData.price}€</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="chart" className="space-y-6">
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
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={false}
                          />
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
                Entrez le symbole d'une action (ex: AAPL, MSFT, GOOGL) pour accéder à une analyse complète : 
                métriques financières, graphiques, informations sur l'entreprise et plus encore.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
