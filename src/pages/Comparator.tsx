import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  X, 
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  Trophy,
  Medal,
  Target,
  DollarSign,
  BarChart3,
  Percent,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from "recharts";

type CompareStock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: number;
  pe: number;
  forwardPE: number;
  peg: number;
  priceToBook: number;
  priceToSales: number;
  evToEbitda: number;
  roic: number;
  roe: number;
  roa: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  fcfYield: number;
  fcfMargin: number;
  revenueGrowth: number;
  epsGrowth: number;
  debtToEquity: number;
  debtToEbitda: number;
  interestCoverage: number;
  currentRatio: number;
  dividendYield: number;
  payoutRatio: number;
  beta: number;
  color: string;
};

const stockColors = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(217, 91%, 60%)",
  "hsl(280, 87%, 65%)",
  "hsl(24, 95%, 53%)",
];

const mockStockData: Record<string, CompareStock> = {
  AAPL: { symbol: "AAPL", name: "Apple Inc.", price: 178.52, change: 2.34, marketCap: 2800e9, pe: 28.5, forwardPE: 25.2, peg: 2.1, priceToBook: 45.2, priceToSales: 7.2, evToEbitda: 21.5, roic: 56.2, roe: 147.2, roa: 28.5, grossMargin: 43.8, operatingMargin: 30.2, netMargin: 25.3, fcfYield: 3.8, fcfMargin: 26.1, revenueGrowth: 8.1, epsGrowth: 12.5, debtToEquity: 1.87, debtToEbitda: 1.2, interestCoverage: 29.5, currentRatio: 0.99, dividendYield: 0.5, payoutRatio: 15.2, beta: 1.28, color: stockColors[0] },
  MSFT: { symbol: "MSFT", name: "Microsoft Corporation", price: 378.91, change: 1.23, marketCap: 2820e9, pe: 35.2, forwardPE: 29.8, peg: 2.4, priceToBook: 12.8, priceToSales: 12.1, evToEbitda: 24.2, roic: 31.4, roe: 38.5, roa: 19.2, grossMargin: 69.8, operatingMargin: 42.1, netMargin: 36.7, fcfYield: 2.9, fcfMargin: 32.5, revenueGrowth: 12.5, epsGrowth: 18.2, debtToEquity: 0.42, debtToEbitda: 0.8, interestCoverage: 42.1, currentRatio: 1.77, dividendYield: 0.8, payoutRatio: 27.5, beta: 0.91, color: stockColors[1] },
  GOOGL: { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: -0.87, marketCap: 1780e9, pe: 23.8, forwardPE: 19.5, peg: 1.2, priceToBook: 5.8, priceToSales: 5.9, evToEbitda: 15.2, roic: 22.1, roe: 24.8, roa: 14.2, grossMargin: 56.2, operatingMargin: 27.5, netMargin: 21.5, fcfYield: 4.2, fcfMargin: 22.8, revenueGrowth: 15.2, epsGrowth: 25.8, debtToEquity: 0.11, debtToEbitda: 0.3, interestCoverage: 185.2, currentRatio: 2.12, dividendYield: 0, payoutRatio: 0, beta: 1.05, color: stockColors[2] },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corporation", price: 495.23, change: 8.45, marketCap: 1220e9, pe: 65.2, forwardPE: 35.8, peg: 0.8, priceToBook: 28.5, priceToSales: 25.8, evToEbitda: 52.1, roic: 38.9, roe: 69.5, roa: 32.1, grossMargin: 72.5, operatingMargin: 54.2, netMargin: 55.6, fcfYield: 1.2, fcfMargin: 38.2, revenueGrowth: 122.4, epsGrowth: 168.5, debtToEquity: 0.41, debtToEbitda: 0.5, interestCoverage: 85.2, currentRatio: 4.17, dividendYield: 0.0, payoutRatio: 1.2, beta: 1.72, color: stockColors[3] },
  META: { symbol: "META", name: "Meta Platforms Inc.", price: 355.82, change: 3.21, marketCap: 920e9, pe: 25.2, forwardPE: 20.1, peg: 1.1, priceToBook: 6.2, priceToSales: 6.8, evToEbitda: 14.5, roic: 24.5, roe: 28.2, roa: 16.8, grossMargin: 80.5, operatingMargin: 35.2, netMargin: 29.1, fcfYield: 3.5, fcfMargin: 28.5, revenueGrowth: 21.5, epsGrowth: 42.8, debtToEquity: 0.28, debtToEbitda: 0.6, interestCoverage: 52.1, currentRatio: 2.68, dividendYield: 0.5, payoutRatio: 8.5, beta: 1.35, color: stockColors[4] },
  AMZN: { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.25, change: 1.85, marketCap: 1850e9, pe: 62.5, forwardPE: 42.1, peg: 1.8, priceToBook: 8.5, priceToSales: 3.2, evToEbitda: 18.5, roic: 12.5, roe: 15.2, roa: 5.8, grossMargin: 46.8, operatingMargin: 6.2, netMargin: 5.1, fcfYield: 2.8, fcfMargin: 8.5, revenueGrowth: 12.8, epsGrowth: 85.2, debtToEquity: 0.58, debtToEbitda: 1.2, interestCoverage: 12.5, currentRatio: 1.05, dividendYield: 0, payoutRatio: 0, beta: 1.18, color: stockColors[0] },
  TSLA: { symbol: "TSLA", name: "Tesla Inc.", price: 248.52, change: -2.15, marketCap: 790e9, pe: 72.5, forwardPE: 58.2, peg: 3.2, priceToBook: 12.8, priceToSales: 8.2, evToEbitda: 45.2, roic: 15.8, roe: 22.5, roa: 8.5, grossMargin: 18.2, operatingMargin: 9.2, netMargin: 10.5, fcfYield: 1.5, fcfMargin: 5.2, revenueGrowth: 18.5, epsGrowth: -25.2, debtToEquity: 0.12, debtToEbitda: 0.8, interestCoverage: 28.5, currentRatio: 1.72, dividendYield: 0, payoutRatio: 0, beta: 2.05, color: stockColors[1] },
};

const availableSymbols = Object.keys(mockStockData);

export default function Comparator() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const addStock = (symbol: string) => {
    if (!selectedStocks.includes(symbol) && selectedStocks.length < 5) {
      setSelectedStocks([...selectedStocks, symbol]);
    }
    setSearchTerm("");
    setShowSearch(false);
  };

  const removeStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter((s) => s !== symbol));
  };

  const filteredSymbols = availableSymbols.filter(
    (s) => s.includes(searchTerm.toUpperCase()) && !selectedStocks.includes(s)
  );

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
    return `$${(value / 1e6).toFixed(0)}M`;
  };

  // Prepare radar chart data
  const getRadarData = () => {
    const metrics = [
      { key: "roic", label: "ROIC", max: 60 },
      { key: "grossMargin", label: "Marge Brute", max: 100 },
      { key: "netMargin", label: "Marge Nette", max: 60 },
      { key: "revenueGrowth", label: "Croissance", max: 50 },
      { key: "fcfYield", label: "FCF Yield", max: 10 },
    ];

    return metrics.map((m) => {
      const data: Record<string, any> = { metric: m.label };
      selectedStocks.forEach((symbol) => {
        const value = mockStockData[symbol][m.key as keyof CompareStock] as number;
        data[symbol] = Math.min((value / m.max) * 100, 100);
      });
      return data;
    });
  };

  // Calculate scores
  const calculateScore = (symbol: string) => {
    const stock = mockStockData[symbol];
    let score = 0;
    
    // Valuation (lower is better)
    if (stock.pe < 20) score += 15;
    else if (stock.pe < 30) score += 10;
    else if (stock.pe < 50) score += 5;
    
    if (stock.peg < 1.5) score += 15;
    else if (stock.peg < 2) score += 10;
    else if (stock.peg < 2.5) score += 5;
    
    // Profitability
    if (stock.roic > 20) score += 20;
    else if (stock.roic > 15) score += 15;
    else if (stock.roic > 10) score += 10;
    
    if (stock.netMargin > 20) score += 15;
    else if (stock.netMargin > 10) score += 10;
    else if (stock.netMargin > 5) score += 5;
    
    // Growth
    if (stock.revenueGrowth > 20) score += 15;
    else if (stock.revenueGrowth > 10) score += 10;
    else if (stock.revenueGrowth > 5) score += 5;
    
    // Financial Health
    if (stock.debtToEquity < 0.5) score += 10;
    else if (stock.debtToEquity < 1) score += 7;
    else if (stock.debtToEquity < 2) score += 3;
    
    if (stock.currentRatio > 1.5) score += 10;
    else if (stock.currentRatio > 1) score += 5;
    
    return Math.min(score, 100);
  };

  const rankedStocks = [...selectedStocks].sort((a, b) => calculateScore(b) - calculateScore(a));

  // Bar chart data for metrics comparison
  const getBarChartData = (metrics: { key: keyof CompareStock; label: string }[]) => {
    return metrics.map((m) => {
      const data: Record<string, any> = { name: m.label };
      selectedStocks.forEach((symbol, index) => {
        data[symbol] = mockStockData[symbol][m.key];
      });
      return data;
    });
  };

  const MetricBar = ({ 
    label, 
    stocks, 
    metricKey, 
    max, 
    format = (v: number) => v.toFixed(1),
    reverse = false 
  }: { 
    label: string; 
    stocks: string[]; 
    metricKey: keyof CompareStock;
    max: number;
    format?: (v: number) => string;
    reverse?: boolean;
  }) => {
    const values = stocks.map(s => ({
      symbol: s,
      value: mockStockData[s][metricKey] as number,
      color: stockColors[stocks.indexOf(s) % stockColors.length]
    }));

    const sorted = [...values].sort((a, b) => reverse ? a.value - b.value : b.value - a.value);
    const best = sorted[0]?.symbol;

    return (
      <div className="space-y-3 p-4 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="space-y-2">
          {values.map(({ symbol, value, color }) => (
            <div key={symbol} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span className={cn(
                    symbol === best && "font-bold"
                  )}>{symbol}</span>
                  {symbol === best && (
                    <Crown className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
                <span className={cn(
                  "font-mono",
                  symbol === best && "font-bold text-primary"
                )}>
                  {format(value)}
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((Math.abs(value) / max) * 100, 100)}%`,
                    backgroundColor: color,
                    opacity: symbol === best ? 1 : 0.6
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="Comparateur d'Actions">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Comparateur d'Actions</h1>
            <p className="text-muted-foreground">Analyse visuelle côte à côte</p>
          </div>
        </div>

        {/* Stock Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {selectedStocks.map((symbol, index) => {
            const stock = mockStockData[symbol];
            const score = calculateScore(symbol);
            const rank = rankedStocks.indexOf(symbol) + 1;
            const color = stockColors[index % stockColors.length];

            return (
              <Card 
                key={symbol} 
                className="relative overflow-hidden animate-fade-in"
                style={{ borderTopColor: color, borderTopWidth: '3px' }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 hover:bg-destructive/20 z-10"
                  onClick={() => removeStock(symbol)}
                >
                  <X className="h-3 w-3" />
                </Button>
                
                {rank === 1 && (
                  <div className="absolute top-2 left-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                )}
                {rank === 2 && (
                  <div className="absolute top-2 left-2">
                    <Medal className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                {rank === 3 && (
                  <div className="absolute top-2 left-2">
                    <Medal className="h-5 w-5 text-amber-600" />
                  </div>
                )}

                <CardContent className="pt-8 pb-4 px-4">
                  <div className="text-center space-y-3">
                    <div 
                      className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: color }}
                    >
                      {symbol.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{symbol}</h3>
                      <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                    </div>
                    <div>
                      <p className="font-display text-2xl font-bold">${stock.price.toFixed(2)}</p>
                      <p className={cn(
                        "text-sm flex items-center justify-center gap-1",
                        stock.change >= 0 ? "text-success" : "text-destructive"
                      )}>
                        {stock.change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                      </p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Score Global</p>
                      <div className="flex items-center gap-2">
                        <Progress value={score} className="flex-1 h-2" />
                        <span className="text-sm font-bold" style={{ color }}>{score}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add Stock Card */}
          {selectedStocks.length < 5 && (
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
              <CardContent className="h-full flex items-center justify-center p-4">
                <div className="relative w-full">
                  {showSearch ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="Symbole..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                      />
                      {searchTerm && filteredSymbols.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-10 max-h-48 overflow-auto">
                          {filteredSymbols.slice(0, 5).map((s) => (
                            <button
                              key={s}
                              className="w-full px-3 py-2 text-left hover:bg-muted transition-colors text-sm"
                              onClick={() => addStock(s)}
                            >
                              <span className="font-medium">{s}</span>
                              <span className="text-muted-foreground ml-2 text-xs">
                                {mockStockData[s].name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full h-full min-h-[180px] flex-col gap-2"
                      onClick={() => setShowSearch(true)}
                    >
                      <Plus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-muted-foreground">Ajouter</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="valuation">Valorisation</TabsTrigger>
            <TabsTrigger value="profitability">Rentabilité</TabsTrigger>
            <TabsTrigger value="health">Santé Financière</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Profil de Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getRadarData()}>
                        <PolarGrid strokeDasharray="3 3" />
                        <PolarAngleAxis 
                          dataKey="metric" 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 100]}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        />
                        {selectedStocks.map((symbol, index) => (
                          <Radar
                            key={symbol}
                            name={symbol}
                            dataKey={symbol}
                            stroke={stockColors[index % stockColors.length]}
                            fill={stockColors[index % stockColors.length]}
                            fillOpacity={0.15}
                            strokeWidth={2}
                          />
                        ))}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Classement Global
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rankedStocks.map((symbol, rank) => {
                    const score = calculateScore(symbol);
                    const stock = mockStockData[symbol];
                    const color = stockColors[selectedStocks.indexOf(symbol) % stockColors.length];

                    return (
                      <div 
                        key={symbol}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl transition-all",
                          rank === 0 && "bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20",
                          rank === 1 && "bg-muted/50",
                          rank === 2 && "bg-muted/30",
                          rank > 2 && "bg-muted/20"
                        )}
                      >
                        <div className="text-2xl font-bold text-muted-foreground w-8">
                          #{rank + 1}
                        </div>
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: color }}
                        >
                          {symbol.slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{symbol}</span>
                            {rank === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{stock.name}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color }}>{score}</div>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricBar 
                label="ROIC (%)" 
                stocks={selectedStocks} 
                metricKey="roic" 
                max={60}
                format={(v) => `${v.toFixed(1)}%`}
              />
              <MetricBar 
                label="Marge Nette (%)" 
                stocks={selectedStocks} 
                metricKey="netMargin" 
                max={60}
                format={(v) => `${v.toFixed(1)}%`}
              />
              <MetricBar 
                label="Croissance CA (%)" 
                stocks={selectedStocks} 
                metricKey="revenueGrowth" 
                max={50}
                format={(v) => `${v.toFixed(1)}%`}
              />
              <MetricBar 
                label="FCF Yield (%)" 
                stocks={selectedStocks} 
                metricKey="fcfYield" 
                max={6}
                format={(v) => `${v.toFixed(1)}%`}
              />
            </div>
          </TabsContent>

          <TabsContent value="valuation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Valuation Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Multiples de Valorisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={getBarChartData([
                          { key: "pe", label: "P/E" },
                          { key: "forwardPE", label: "Forward P/E" },
                          { key: "evToEbitda", label: "EV/EBITDA" },
                        ])}
                        layout="vertical"
                      >
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Legend />
                        {selectedStocks.map((symbol, index) => (
                          <Bar 
                            key={symbol} 
                            dataKey={symbol} 
                            fill={stockColors[index % stockColors.length]}
                            radius={[0, 4, 4, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4">
                <MetricBar 
                  label="P/E Ratio (plus bas = mieux)" 
                  stocks={selectedStocks} 
                  metricKey="pe" 
                  max={80}
                  reverse
                />
                <MetricBar 
                  label="PEG Ratio (plus bas = mieux)" 
                  stocks={selectedStocks} 
                  metricKey="peg" 
                  max={4}
                  reverse
                />
                <MetricBar 
                  label="EV/EBITDA (plus bas = mieux)" 
                  stocks={selectedStocks} 
                  metricKey="evToEbitda" 
                  max={60}
                  reverse
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profitability" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Margins Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-primary" />
                    Comparaison des Marges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={getBarChartData([
                          { key: "grossMargin", label: "Marge Brute" },
                          { key: "operatingMargin", label: "Marge Op." },
                          { key: "netMargin", label: "Marge Nette" },
                          { key: "fcfMargin", label: "Marge FCF" },
                        ])}
                        layout="vertical"
                      >
                        <XAxis type="number" unit="%" />
                        <YAxis dataKey="name" type="category" width={90} />
                        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                        <Legend />
                        {selectedStocks.map((symbol, index) => (
                          <Bar 
                            key={symbol} 
                            dataKey={symbol} 
                            fill={stockColors[index % stockColors.length]}
                            radius={[0, 4, 4, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4">
                <MetricBar 
                  label="ROIC - Retour sur Capital Investi" 
                  stocks={selectedStocks} 
                  metricKey="roic" 
                  max={60}
                  format={(v) => `${v.toFixed(1)}%`}
                />
                <MetricBar 
                  label="ROE - Retour sur Fonds Propres" 
                  stocks={selectedStocks} 
                  metricKey="roe" 
                  max={150}
                  format={(v) => `${v.toFixed(1)}%`}
                />
                <MetricBar 
                  label="ROA - Retour sur Actifs" 
                  stocks={selectedStocks} 
                  metricKey="roa" 
                  max={35}
                  format={(v) => `${v.toFixed(1)}%`}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Santé Financière
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={getBarChartData([
                          { key: "debtToEquity", label: "Dette/Equity" },
                          { key: "currentRatio", label: "Current Ratio" },
                          { key: "debtToEbitda", label: "Dette/EBITDA" },
                        ])}
                        layout="vertical"
                      >
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        {selectedStocks.map((symbol, index) => (
                          <Bar 
                            key={symbol} 
                            dataKey={symbol} 
                            fill={stockColors[index % stockColors.length]}
                            radius={[0, 4, 4, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4">
                <MetricBar 
                  label="Dette/Equity (plus bas = mieux)" 
                  stocks={selectedStocks} 
                  metricKey="debtToEquity" 
                  max={3}
                  reverse
                />
                <MetricBar 
                  label="Current Ratio (plus haut = mieux)" 
                  stocks={selectedStocks} 
                  metricKey="currentRatio" 
                  max={5}
                />
                <MetricBar 
                  label="Couverture des Intérêts" 
                  stocks={selectedStocks} 
                  metricKey="interestCoverage" 
                  max={100}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
