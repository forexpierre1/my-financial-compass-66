import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  X, 
  Search,
  TrendingUp,
  TrendingDown,
  Scale,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

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
};

const mockStockData: Record<string, CompareStock> = {
  AAPL: { symbol: "AAPL", name: "Apple Inc.", price: 178.52, change: 2.34, marketCap: 2800e9, pe: 28.5, forwardPE: 25.2, peg: 2.1, priceToBook: 45.2, priceToSales: 7.2, evToEbitda: 21.5, roic: 56.2, roe: 147.2, roa: 28.5, grossMargin: 43.8, operatingMargin: 30.2, netMargin: 25.3, fcfYield: 3.8, fcfMargin: 26.1, revenueGrowth: 8.1, epsGrowth: 12.5, debtToEquity: 1.87, debtToEbitda: 1.2, interestCoverage: 29.5, currentRatio: 0.99, dividendYield: 0.5, payoutRatio: 15.2, beta: 1.28 },
  MSFT: { symbol: "MSFT", name: "Microsoft Corporation", price: 378.91, change: 1.23, marketCap: 2820e9, pe: 35.2, forwardPE: 29.8, peg: 2.4, priceToBook: 12.8, priceToSales: 12.1, evToEbitda: 24.2, roic: 31.4, roe: 38.5, roa: 19.2, grossMargin: 69.8, operatingMargin: 42.1, netMargin: 36.7, fcfYield: 2.9, fcfMargin: 32.5, revenueGrowth: 12.5, epsGrowth: 18.2, debtToEquity: 0.42, debtToEbitda: 0.8, interestCoverage: 42.1, currentRatio: 1.77, dividendYield: 0.8, payoutRatio: 27.5, beta: 0.91 },
  GOOGL: { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: -0.87, marketCap: 1780e9, pe: 23.8, forwardPE: 19.5, peg: 1.2, priceToBook: 5.8, priceToSales: 5.9, evToEbitda: 15.2, roic: 22.1, roe: 24.8, roa: 14.2, grossMargin: 56.2, operatingMargin: 27.5, netMargin: 21.5, fcfYield: 4.2, fcfMargin: 22.8, revenueGrowth: 15.2, epsGrowth: 25.8, debtToEquity: 0.11, debtToEbitda: 0.3, interestCoverage: 185.2, currentRatio: 2.12, dividendYield: 0, payoutRatio: 0, beta: 1.05 },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corporation", price: 495.23, change: 8.45, marketCap: 1220e9, pe: 65.2, forwardPE: 35.8, peg: 0.8, priceToBook: 28.5, priceToSales: 25.8, evToEbitda: 52.1, roic: 38.9, roe: 69.5, roa: 32.1, grossMargin: 72.5, operatingMargin: 54.2, netMargin: 55.6, fcfYield: 1.2, fcfMargin: 38.2, revenueGrowth: 122.4, epsGrowth: 168.5, debtToEquity: 0.41, debtToEbitda: 0.5, interestCoverage: 85.2, currentRatio: 4.17, dividendYield: 0.0, payoutRatio: 1.2, beta: 1.72 },
  META: { symbol: "META", name: "Meta Platforms Inc.", price: 355.82, change: 3.21, marketCap: 920e9, pe: 25.2, forwardPE: 20.1, peg: 1.1, priceToBook: 6.2, priceToSales: 6.8, evToEbitda: 14.5, roic: 24.5, roe: 28.2, roa: 16.8, grossMargin: 80.5, operatingMargin: 35.2, netMargin: 29.1, fcfYield: 3.5, fcfMargin: 28.5, revenueGrowth: 21.5, epsGrowth: 42.8, debtToEquity: 0.28, debtToEbitda: 0.6, interestCoverage: 52.1, currentRatio: 2.68, dividendYield: 0.5, payoutRatio: 8.5, beta: 1.35 },
  AMZN: { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.25, change: 1.85, marketCap: 1850e9, pe: 62.5, forwardPE: 42.1, peg: 1.8, priceToBook: 8.5, priceToSales: 3.2, evToEbitda: 18.5, roic: 12.5, roe: 15.2, roa: 5.8, grossMargin: 46.8, operatingMargin: 6.2, netMargin: 5.1, fcfYield: 2.8, fcfMargin: 8.5, revenueGrowth: 12.8, epsGrowth: 85.2, debtToEquity: 0.58, debtToEbitda: 1.2, interestCoverage: 12.5, currentRatio: 1.05, dividendYield: 0, payoutRatio: 0, beta: 1.18 },
  TSLA: { symbol: "TSLA", name: "Tesla Inc.", price: 248.52, change: -2.15, marketCap: 790e9, pe: 72.5, forwardPE: 58.2, peg: 3.2, priceToBook: 12.8, priceToSales: 8.2, evToEbitda: 45.2, roic: 15.8, roe: 22.5, roa: 8.5, grossMargin: 18.2, operatingMargin: 9.2, netMargin: 10.5, fcfYield: 1.5, fcfMargin: 5.2, revenueGrowth: 18.5, epsGrowth: -25.2, debtToEquity: 0.12, debtToEbitda: 0.8, interestCoverage: 28.5, currentRatio: 1.72, dividendYield: 0, payoutRatio: 0, beta: 2.05 },
};

const availableSymbols = Object.keys(mockStockData);

type MetricCategory = {
  name: string;
  metrics: {
    key: keyof CompareStock;
    label: string;
    format: (v: number) => string;
    goodIf?: "high" | "low";
    thresholds?: { good: number; bad: number };
  }[];
};

const metricCategories: MetricCategory[] = [
  {
    name: "Valorisation",
    metrics: [
      { key: "pe", label: "P/E Ratio", format: (v) => v.toFixed(1), goodIf: "low", thresholds: { good: 20, bad: 40 } },
      { key: "forwardPE", label: "Forward P/E", format: (v) => v.toFixed(1), goodIf: "low", thresholds: { good: 18, bad: 35 } },
      { key: "peg", label: "PEG Ratio", format: (v) => v.toFixed(2), goodIf: "low", thresholds: { good: 1.5, bad: 2.5 } },
      { key: "priceToBook", label: "P/B Ratio", format: (v) => v.toFixed(1) },
      { key: "priceToSales", label: "P/S Ratio", format: (v) => v.toFixed(1) },
      { key: "evToEbitda", label: "EV/EBITDA", format: (v) => v.toFixed(1), goodIf: "low", thresholds: { good: 12, bad: 25 } },
    ],
  },
  {
    name: "Rentabilité",
    metrics: [
      { key: "roic", label: "ROIC", format: (v) => `${v.toFixed(1)}%`, goodIf: "high", thresholds: { good: 15, bad: 8 } },
      { key: "roe", label: "ROE", format: (v) => `${v.toFixed(1)}%`, goodIf: "high", thresholds: { good: 20, bad: 10 } },
      { key: "roa", label: "ROA", format: (v) => `${v.toFixed(1)}%`, goodIf: "high", thresholds: { good: 10, bad: 5 } },
    ],
  },
  {
    name: "Marges",
    metrics: [
      { key: "grossMargin", label: "Marge brute", format: (v) => `${v.toFixed(1)}%`, goodIf: "high", thresholds: { good: 40, bad: 20 } },
      { key: "operatingMargin", label: "Marge opérationnelle", format: (v) => `${v.toFixed(1)}%`, goodIf: "high", thresholds: { good: 20, bad: 10 } },
      { key: "netMargin", label: "Marge nette", format: (v) => `${v.toFixed(1)}%`, goodIf: "high", thresholds: { good: 15, bad: 5 } },
      { key: "fcfMargin", label: "Marge FCF", format: (v) => `${v.toFixed(1)}%`, goodIf: "high", thresholds: { good: 15, bad: 5 } },
    ],
  },
  {
    name: "Croissance",
    metrics: [
      { key: "revenueGrowth", label: "Croissance CA", format: (v) => `${v.toFixed(1)}%`, goodIf: "high", thresholds: { good: 15, bad: 0 } },
      { key: "epsGrowth", label: "Croissance EPS", format: (v) => `${v.toFixed(1)}%`, goodIf: "high", thresholds: { good: 15, bad: 0 } },
    ],
  },
  {
    name: "Dette & Liquidité",
    metrics: [
      { key: "debtToEquity", label: "Dette/Equity", format: (v) => v.toFixed(2), goodIf: "low", thresholds: { good: 0.5, bad: 2 } },
      { key: "debtToEbitda", label: "Dette/EBITDA", format: (v) => v.toFixed(1), goodIf: "low", thresholds: { good: 1.5, bad: 3 } },
      { key: "interestCoverage", label: "Couverture intérêts", format: (v) => v.toFixed(1), goodIf: "high", thresholds: { good: 10, bad: 3 } },
      { key: "currentRatio", label: "Current Ratio", format: (v) => v.toFixed(2), goodIf: "high", thresholds: { good: 1.5, bad: 1 } },
    ],
  },
  {
    name: "Cash Flow",
    metrics: [
      { key: "fcfYield", label: "FCF Yield", format: (v) => `${v.toFixed(1)}%`, goodIf: "high", thresholds: { good: 4, bad: 2 } },
    ],
  },
  {
    name: "Dividendes & Risque",
    metrics: [
      { key: "dividendYield", label: "Rendement dividende", format: (v) => `${v.toFixed(1)}%` },
      { key: "payoutRatio", label: "Payout Ratio", format: (v) => `${v.toFixed(1)}%`, goodIf: "low", thresholds: { good: 40, bad: 80 } },
      { key: "beta", label: "Beta", format: (v) => v.toFixed(2) },
    ],
  },
];

export default function Comparator() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>(["AAPL", "MSFT", "GOOGL"]);
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

  const getBestWorst = (metricKey: keyof CompareStock, goodIf?: "high" | "low") => {
    const values = selectedStocks.map((s) => ({
      symbol: s,
      value: mockStockData[s][metricKey] as number,
    }));
    if (!goodIf) return { best: null, worst: null };
    
    const sorted = [...values].sort((a, b) => 
      goodIf === "high" ? b.value - a.value : a.value - b.value
    );
    return { best: sorted[0]?.symbol, worst: sorted[sorted.length - 1]?.symbol };
  };

  return (
    <DashboardLayout title="Comparateur d'Actions">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Comparateur d'Actions</h1>
            <p className="text-muted-foreground">Comparez jusqu'à 5 actions côte à côte</p>
          </div>
        </div>

        {/* Stock Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              {selectedStocks.map((symbol) => {
                const stock = mockStockData[symbol];
                return (
                  <Badge 
                    key={symbol} 
                    variant="secondary" 
                    className="pl-3 pr-1 py-2 text-sm flex items-center gap-2"
                  >
                    <span className="font-bold">{symbol}</span>
                    <span className="text-muted-foreground">{stock.name.split(" ")[0]}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 hover:bg-destructive/20"
                      onClick={() => removeStock(symbol)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
              
              {selectedStocks.length < 5 && (
                <div className="relative">
                  {showSearch ? (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Symbole..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-32"
                        autoFocus
                        onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                      />
                      {searchTerm && filteredSymbols.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 bg-popover border rounded-md shadow-lg z-10">
                          {filteredSymbols.slice(0, 5).map((s) => (
                            <button
                              key={s}
                              className="w-full px-3 py-2 text-left hover:bg-muted transition-colors text-sm"
                              onClick={() => addStock(s)}
                            >
                              <span className="font-medium">{s}</span>
                              <span className="text-muted-foreground ml-2">
                                {mockStockData[s].name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSearch(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stock Headers */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Action</TableHead>
                  {selectedStocks.map((symbol) => {
                    const stock = mockStockData[symbol];
                    return (
                      <TableHead key={symbol} className="text-center min-w-[140px]">
                        <div className="space-y-1">
                          <div className="font-bold text-lg">{symbol}</div>
                          <div className="text-xs text-muted-foreground font-normal truncate">
                            {stock.name}
                          </div>
                          <div className="font-bold">${stock.price.toFixed(2)}</div>
                          <div className={cn(
                            "text-xs flex items-center justify-center gap-1",
                            stock.change >= 0 ? "text-success" : "text-destructive"
                          )}>
                            {stock.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                          </div>
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Market Cap</TableCell>
                  {selectedStocks.map((symbol) => (
                    <TableCell key={symbol} className="text-center">
                      {formatMarketCap(mockStockData[symbol].marketCap)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Metric Categories */}
        {metricCategories.map((category) => (
          <Card key={category.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {category.metrics.map((metric) => {
                    const { best, worst } = getBestWorst(metric.key, metric.goodIf);
                    return (
                      <TableRow key={metric.key}>
                        <TableCell className="w-48 font-medium">{metric.label}</TableCell>
                        {selectedStocks.map((symbol) => {
                          const value = mockStockData[symbol][metric.key] as number;
                          const isBest = symbol === best;
                          const isWorst = symbol === worst && selectedStocks.length > 1;
                          
                          return (
                            <TableCell 
                              key={symbol} 
                              className={cn(
                                "text-center min-w-[140px]",
                                isBest && "bg-success/10 text-success font-semibold",
                                isWorst && "bg-destructive/10 text-destructive"
                              )}
                            >
                              {metric.format(value)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
