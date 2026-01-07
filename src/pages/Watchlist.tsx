import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  FolderPlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type WatchlistItem = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

type Watchlist = {
  id: string;
  name: string;
  color: string;
  items: WatchlistItem[];
};

const initialWatchlists: Watchlist[] = [];

const colorOptions = [
  { value: "bg-blue-500", label: "Bleu" },
  { value: "bg-green-500", label: "Vert" },
  { value: "bg-purple-500", label: "Violet" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-pink-500", label: "Rose" },
  { value: "bg-yellow-500", label: "Jaune" },
];

export default function Watchlist() {
  const navigate = useNavigate();
  const [watchlists, setWatchlists] = useState<Watchlist[]>(initialWatchlists);
  const [selectedWatchlist, setSelectedWatchlist] = useState<string>(watchlists[0]?.id || "");
  const [isAddWatchlistOpen, setIsAddWatchlistOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [newWatchlistColor, setNewWatchlistColor] = useState("bg-blue-500");
  const [newStock, setNewStock] = useState({ symbol: "", name: "" });

  const currentWatchlist = watchlists.find(w => w.id === selectedWatchlist);

  const handleAddWatchlist = () => {
    if (!newWatchlistName.trim()) return;
    
    const newWatchlist: Watchlist = {
      id: Date.now().toString(),
      name: newWatchlistName,
      color: newWatchlistColor,
      items: [],
    };
    
    setWatchlists([...watchlists, newWatchlist]);
    setSelectedWatchlist(newWatchlist.id);
    setNewWatchlistName("");
    setIsAddWatchlistOpen(false);
    toast.success("Watchlist créée !");
  };

  const handleDeleteWatchlist = (id: string) => {
    setWatchlists(watchlists.filter(w => w.id !== id));
    if (selectedWatchlist === id && watchlists.length > 1) {
      setSelectedWatchlist(watchlists[0].id);
    }
    toast.success("Watchlist supprimée");
  };

  const handleAddStock = () => {
    if (!newStock.symbol.trim() || !currentWatchlist) return;
    
    const mockPrice = Math.random() * 500 + 10;
    const mockChange = (Math.random() - 0.5) * 20;
    
    const newItem: WatchlistItem = {
      id: Date.now().toString(),
      symbol: newStock.symbol.toUpperCase(),
      name: newStock.name || newStock.symbol.toUpperCase(),
      price: parseFloat(mockPrice.toFixed(2)),
      change: parseFloat(mockChange.toFixed(2)),
      changePercent: parseFloat(((mockChange / mockPrice) * 100).toFixed(2)),
    };
    
    setWatchlists(watchlists.map(w => 
      w.id === selectedWatchlist 
        ? { ...w, items: [...w.items, newItem] }
        : w
    ));
    
    setNewStock({ symbol: "", name: "" });
    setIsAddStockOpen(false);
    toast.success("Actif ajouté !");
  };

  const handleRemoveStock = (stockId: string) => {
    setWatchlists(watchlists.map(w => 
      w.id === selectedWatchlist 
        ? { ...w, items: w.items.filter(item => item.id !== stockId) }
        : w
    ));
    toast.success("Actif retiré");
  };

  const handleAnalyzeStock = (symbol: string) => {
    navigate(`/analyzer?symbol=${symbol}`);
  };

  return (
    <DashboardLayout title="Watchlist">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Watchlist</h1>
            <p className="text-muted-foreground">Suivez vos actifs favoris</p>
          </div>
          <Dialog open={isAddWatchlistOpen} onOpenChange={setIsAddWatchlistOpen}>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="h-4 w-4 mr-2" />
                Nouvelle Watchlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une Watchlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nom de la watchlist</Label>
                  <Input
                    placeholder="Ex: Actions Tech"
                    value={newWatchlistName}
                    onChange={(e) => setNewWatchlistName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Couleur</Label>
                  <Select value={newWatchlistColor} onValueChange={setNewWatchlistColor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={cn("h-3 w-3 rounded-full", color.value)} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddWatchlist} className="w-full">
                  Créer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Watchlist Tabs */}
        <div className="flex gap-2 flex-wrap">
          {watchlists.map(watchlist => (
            <button
              key={watchlist.id}
              onClick={() => setSelectedWatchlist(watchlist.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all border",
                selectedWatchlist === watchlist.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-secondary border-border"
              )}
            >
              <div className={cn("h-2 w-2 rounded-full", watchlist.color)} />
              <span className="font-medium">{watchlist.name}</span>
              <Badge variant="secondary" className="ml-1">
                {watchlist.items.length}
              </Badge>
            </button>
          ))}
        </div>

        {/* Current Watchlist Content */}
        {currentWatchlist && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("h-4 w-4 rounded-full", currentWatchlist.color)} />
                <CardTitle>{currentWatchlist.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isAddStockOpen} onOpenChange={setIsAddStockOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un actif
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un actif</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Symbole / Ticker</Label>
                        <Input
                          placeholder="Ex: AAPL, MSFT, BTC..."
                          value={newStock.symbol}
                          onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nom (optionnel)</Label>
                        <Input
                          placeholder="Ex: Apple Inc."
                          value={newStock.name}
                          onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleAddStock} className="w-full">
                        Ajouter
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteWatchlist(currentWatchlist.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer la watchlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              {currentWatchlist.items.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Aucun actif dans cette watchlist</p>
                  <p className="text-sm">Ajoutez vos premiers actifs à suivre</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentWatchlist.items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary text-sm">{item.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{item.symbol}</p>
                          <p className="text-sm text-muted-foreground">{item.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-medium">{item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                          <div className={cn(
                            "flex items-center gap-1 text-sm",
                            item.change >= 0 ? "text-success" : "text-destructive"
                          )}>
                            {item.change >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>{item.change >= 0 ? "+" : ""}{item.changePercent}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleAnalyzeStock(item.symbol)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveStock(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {watchlists.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <FolderPlus className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="font-display text-xl font-semibold mb-2">Aucune watchlist</h3>
              <p className="text-muted-foreground mb-6">
                Créez votre première watchlist pour commencer à suivre vos actifs
              </p>
              <Button onClick={() => setIsAddWatchlistOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Créer une watchlist
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
