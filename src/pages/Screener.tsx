import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown,
  RotateCcw,
  ArrowUpDown,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

type FilterConfig = {
  peMin: number;
  peMax: number;
  roicMin: number;
  fcfYieldMin: number;
  debtToEquityMax: number;
  revenueGrowthMin: number;
  netMarginMin: number;
  dividendYieldMin: number;
  sector: string;
  marketCapMin: string;
};

type StockResult = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  pe: number;
  roic: number;
  fcfYield: number;
  debtToEquity: number;
  revenueGrowth: number;
  netMargin: number;
  dividendYield: number;
  marketCap: number;
  sector: string;
};

const mockStocks: StockResult[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.52, change: 2.34, pe: 28.5, roic: 56.2, fcfYield: 3.8, debtToEquity: 1.87, revenueGrowth: 8.1, netMargin: 25.3, dividendYield: 0.5, marketCap: 2800e9, sector: "Technologie" },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 378.91, change: 1.23, pe: 35.2, roic: 31.4, fcfYield: 2.9, debtToEquity: 0.42, revenueGrowth: 12.5, netMargin: 36.7, dividendYield: 0.8, marketCap: 2820e9, sector: "Technologie" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: -0.87, pe: 23.8, roic: 22.1, fcfYield: 4.2, debtToEquity: 0.11, revenueGrowth: 15.2, netMargin: 21.5, dividendYield: 0, marketCap: 1780e9, sector: "Technologie" },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 156.23, change: 0.45, pe: 14.2, roic: 18.5, fcfYield: 5.1, debtToEquity: 0.44, revenueGrowth: 3.2, netMargin: 18.9, dividendYield: 3.0, marketCap: 380e9, sector: "Santé" },
  { symbol: "PG", name: "Procter & Gamble", price: 152.87, change: 0.32, pe: 25.1, roic: 17.8, fcfYield: 4.5, debtToEquity: 0.78, revenueGrowth: 4.5, netMargin: 17.2, dividendYield: 2.5, marketCap: 360e9, sector: "Consommation" },
  { symbol: "V", name: "Visa Inc.", price: 278.45, change: 1.89, pe: 29.8, roic: 25.3, fcfYield: 3.2, debtToEquity: 0.52, revenueGrowth: 11.8, netMargin: 52.1, dividendYield: 0.8, marketCap: 580e9, sector: "Finance" },
  { symbol: "KO", name: "Coca-Cola Company", price: 58.92, change: -0.12, pe: 22.5, roic: 12.4, fcfYield: 4.8, debtToEquity: 1.85, revenueGrowth: 5.8, netMargin: 22.3, dividendYield: 3.1, marketCap: 255e9, sector: "Consommation" },
  { symbol: "UNH", name: "UnitedHealth Group", price: 512.34, change: 3.21, pe: 18.9, roic: 19.2, fcfYield: 4.1, debtToEquity: 0.71, revenueGrowth: 12.1, netMargin: 5.8, dividendYield: 1.4, marketCap: 470e9, sector: "Santé" },
  { symbol: "HD", name: "Home Depot", price: 345.67, change: 2.45, pe: 21.3, roic: 42.5, fcfYield: 3.6, debtToEquity: 8.21, revenueGrowth: 2.8, netMargin: 10.2, dividendYield: 2.5, marketCap: 345e9, sector: "Consommation" },
  { symbol: "MA", name: "Mastercard Inc.", price: 425.89, change: 2.12, pe: 34.2, roic: 48.7, fcfYield: 2.8, debtToEquity: 2.15, revenueGrowth: 13.5, netMargin: 45.2, dividendYield: 0.6, marketCap: 420e9, sector: "Finance" },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 495.23, change: 8.45, pe: 65.2, roic: 38.9, fcfYield: 1.2, debtToEquity: 0.41, revenueGrowth: 122.4, netMargin: 55.6, dividendYield: 0.0, marketCap: 1220e9, sector: "Technologie" },
  { symbol: "BRK.B", name: "Berkshire Hathaway", price: 356.78, change: 1.23, pe: 8.5, roic: 9.8, fcfYield: 6.2, debtToEquity: 0.25, revenueGrowth: 8.9, netMargin: 15.3, dividendYield: 0, marketCap: 780e9, sector: "Finance" },
];

const defaultFilters: FilterConfig = {
  peMin: 0,
  peMax: 100,
  roicMin: 0,
  fcfYieldMin: 0,
  debtToEquityMax: 10,
  revenueGrowthMin: -50,
  netMarginMin: 0,
  dividendYieldMin: 0,
  sector: "all",
  marketCapMin: "all",
};

export default function Screener() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterConfig>(defaultFilters);
  const [sortColumn, setSortColumn] = useState<keyof StockResult>("roic");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(true);

  const filteredStocks = mockStocks
    .filter((stock) => {
      if (stock.pe < filters.peMin || stock.pe > filters.peMax) return false;
      if (stock.roic < filters.roicMin) return false;
      if (stock.fcfYield < filters.fcfYieldMin) return false;
      if (stock.debtToEquity > filters.debtToEquityMax) return false;
      if (stock.revenueGrowth < filters.revenueGrowthMin) return false;
      if (stock.netMargin < filters.netMarginMin) return false;
      if (stock.dividendYield < filters.dividendYieldMin) return false;
      if (filters.sector !== "all" && stock.sector !== filters.sector) return false;
      if (filters.marketCapMin !== "all") {
        const minCap = parseFloat(filters.marketCapMin) * 1e9;
        if (stock.marketCap < minCap) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

  const handleSort = (column: keyof StockResult) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const resetFilters = () => setFilters(defaultFilters);

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(0)}B`;
    return `${(value / 1e6).toFixed(0)}M`;
  };

  const SortableHeader = ({ column, label }: { column: keyof StockResult; label: string }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={cn(
          "h-3 w-3",
          sortColumn === column ? "text-primary" : "text-muted-foreground"
        )} />
      </div>
    </TableHead>
  );

  return (
    <DashboardLayout title="Screener d'Actions">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Screener d'Actions</h1>
            <p className="text-muted-foreground">Trouvez des opportunités avec vos critères</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Masquer filtres" : "Afficher filtres"}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres de recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* P/E Ratio */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">P/E Ratio: {filters.peMin} - {filters.peMax}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={filters.peMin}
                      onChange={(e) => setFilters({ ...filters, peMin: parseFloat(e.target.value) || 0 })}
                      className="w-20"
                      placeholder="Min"
                    />
                    <span className="text-muted-foreground self-center">à</span>
                    <Input
                      type="number"
                      value={filters.peMax}
                      onChange={(e) => setFilters({ ...filters, peMax: parseFloat(e.target.value) || 100 })}
                      className="w-20"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* ROIC Min */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">ROIC Min: {filters.roicMin}%</Label>
                  <Slider
                    value={[filters.roicMin]}
                    onValueChange={([v]) => setFilters({ ...filters, roicMin: v })}
                    max={50}
                    step={1}
                  />
                </div>

                {/* FCF Yield Min */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">FCF Yield Min: {filters.fcfYieldMin}%</Label>
                  <Slider
                    value={[filters.fcfYieldMin]}
                    onValueChange={([v]) => setFilters({ ...filters, fcfYieldMin: v })}
                    max={10}
                    step={0.5}
                  />
                </div>

                {/* Debt/Equity Max */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Dette/Equity Max: {filters.debtToEquityMax}</Label>
                  <Slider
                    value={[filters.debtToEquityMax]}
                    onValueChange={([v]) => setFilters({ ...filters, debtToEquityMax: v })}
                    max={10}
                    step={0.1}
                  />
                </div>

                {/* Revenue Growth Min */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Croissance CA Min: {filters.revenueGrowthMin}%</Label>
                  <Slider
                    value={[filters.revenueGrowthMin]}
                    onValueChange={([v]) => setFilters({ ...filters, revenueGrowthMin: v })}
                    min={-50}
                    max={100}
                    step={1}
                  />
                </div>

                {/* Net Margin Min */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Marge nette Min: {filters.netMarginMin}%</Label>
                  <Slider
                    value={[filters.netMarginMin]}
                    onValueChange={([v]) => setFilters({ ...filters, netMarginMin: v })}
                    max={50}
                    step={1}
                  />
                </div>

                {/* Dividend Yield Min */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Dividende Min: {filters.dividendYieldMin}%</Label>
                  <Slider
                    value={[filters.dividendYieldMin]}
                    onValueChange={([v]) => setFilters({ ...filters, dividendYieldMin: v })}
                    max={8}
                    step={0.1}
                  />
                </div>

                {/* Sector */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Secteur</Label>
                  <Select 
                    value={filters.sector} 
                    onValueChange={(v) => setFilters({ ...filters, sector: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les secteurs</SelectItem>
                      <SelectItem value="Technologie">Technologie</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Santé">Santé</SelectItem>
                      <SelectItem value="Consommation">Consommation</SelectItem>
                      <SelectItem value="Industrie">Industrie</SelectItem>
                      <SelectItem value="Énergie">Énergie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {filteredStocks.length} actions trouvées
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <SortableHeader column="price" label="Prix" />
                    <SortableHeader column="pe" label="P/E" />
                    <SortableHeader column="roic" label="ROIC" />
                    <SortableHeader column="fcfYield" label="FCF Yield" />
                    <SortableHeader column="debtToEquity" label="D/E" />
                    <SortableHeader column="revenueGrowth" label="Croiss. CA" />
                    <SortableHeader column="netMargin" label="Marge" />
                    <SortableHeader column="dividendYield" label="Div." />
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.map((stock) => (
                    <TableRow 
                      key={stock.symbol} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/analyzer?symbol=${stock.symbol}`)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{stock.symbol}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{stock.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">${stock.price.toFixed(2)}</p>
                          <p className={cn(
                            "text-xs",
                            stock.change >= 0 ? "text-success" : "text-destructive"
                          )}>
                            {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stock.pe < 20 ? "default" : stock.pe < 35 ? "secondary" : "destructive"} 
                          className={stock.pe < 20 ? "bg-success text-success-foreground" : ""}>
                          {stock.pe.toFixed(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stock.roic > 15 ? "default" : "secondary"}
                          className={stock.roic > 15 ? "bg-success text-success-foreground" : ""}>
                          {stock.roic.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stock.fcfYield > 4 ? "default" : "secondary"}
                          className={stock.fcfYield > 4 ? "bg-success text-success-foreground" : ""}>
                          {stock.fcfYield.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stock.debtToEquity < 1 ? "default" : stock.debtToEquity < 2 ? "secondary" : "destructive"}
                          className={stock.debtToEquity < 1 ? "bg-success text-success-foreground" : ""}>
                          {stock.debtToEquity.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={stock.revenueGrowth >= 0 ? "text-success" : "text-destructive"}>
                          {stock.revenueGrowth >= 0 ? "+" : ""}{stock.revenueGrowth.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>{stock.netMargin.toFixed(1)}%</TableCell>
                      <TableCell>{stock.dividendYield.toFixed(1)}%</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
