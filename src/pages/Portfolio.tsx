import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AllocationChart } from "@/components/AllocationChart";
import { PerformanceChart } from "@/components/PerformanceChart";
import { Plus, TrendingUp, TrendingDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Asset {
  id: string;
  name: string;
  type: "stocks" | "etf" | "crypto" | "bonds" | "cash";
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  color: string;
}

const typeColors: Record<string, string> = {
  stocks: "hsl(199 89% 48%)",
  etf: "hsl(160 84% 39%)",
  crypto: "hsl(280 80% 55%)",
  bonds: "hsl(38 92% 50%)",
  cash: "hsl(215 20% 55%)",
};

const typeLabels: Record<string, string> = {
  stocks: "Actions",
  etf: "ETF",
  crypto: "Crypto",
  bonds: "Obligations",
  cash: "Cash",
};

const performanceData: { date: string; value: number }[] = [];

export default function Portfolio() {
  const [assets, setAssets] = useState<Asset[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "stocks" as Asset["type"],
    quantity: "",
    buyPrice: "",
    currentPrice: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "stocks",
      quantity: "",
      buyPrice: "",
      currentPrice: "",
    });
    setEditingAsset(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAsset: Asset = {
      id: editingAsset?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      quantity: parseFloat(formData.quantity),
      buyPrice: parseFloat(formData.buyPrice),
      currentPrice: parseFloat(formData.currentPrice),
      color: typeColors[formData.type],
    };

    if (editingAsset) {
      setAssets(assets.map(a => a.id === editingAsset.id ? newAsset : a));
      toast.success("Actif modifié avec succès");
    } else {
      setAssets([...assets, newAsset]);
      toast.success("Actif ajouté avec succès");
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      type: asset.type,
      quantity: asset.quantity.toString(),
      buyPrice: asset.buyPrice.toString(),
      currentPrice: asset.currentPrice.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
    toast.success("Actif supprimé");
  };

  const totalValue = assets.reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
  const totalCost = assets.reduce((sum, a) => sum + a.quantity * a.buyPrice, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = ((totalGain / totalCost) * 100).toFixed(2);

  const allocationData = Object.entries(
    assets.reduce((acc, asset) => {
      const value = asset.quantity * asset.currentPrice;
      acc[asset.type] = (acc[asset.type] || 0) + value;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, value]) => ({
    name: typeLabels[type],
    value,
    color: typeColors[type],
  }));

  return (
    <DashboardLayout title="Portefeuille" subtitle="Gérez vos investissements">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated" className="animate-slide-up">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Valeur totale</p>
              <p className="text-3xl font-display font-bold">{totalValue.toLocaleString()} €</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Plus-value latente</p>
              <p className={cn(
                "text-3xl font-display font-bold flex items-center gap-2",
                totalGain >= 0 ? "text-success" : "text-destructive"
              )}>
                {totalGain >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                {totalGain >= 0 ? "+" : ""}{totalGain.toLocaleString()} €
              </p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Performance</p>
              <p className={cn(
                "text-3xl font-display font-bold",
                parseFloat(totalGainPercent) >= 0 ? "text-success" : "text-destructive"
              )}>
                {parseFloat(totalGainPercent) >= 0 ? "+" : ""}{totalGainPercent}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart data={performanceData} title="Évolution du portefeuille" />
          <AllocationChart data={allocationData} title="Répartition par type" />
        </div>

        {/* Assets List */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mes actifs</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un actif
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAsset ? "Modifier l'actif" : "Ajouter un actif"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Apple, Bitcoin..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: Asset["type"]) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stocks">Actions</SelectItem>
                        <SelectItem value="etf">ETF</SelectItem>
                        <SelectItem value="crypto">Crypto</SelectItem>
                        <SelectItem value="bonds">Obligations</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantité</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="any"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buyPrice">Prix d'achat (€)</Label>
                      <Input
                        id="buyPrice"
                        type="number"
                        step="any"
                        value={formData.buyPrice}
                        onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentPrice">Prix actuel (€)</Label>
                      <Input
                        id="currentPrice"
                        type="number"
                        step="any"
                        value={formData.currentPrice}
                        onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingAsset ? "Modifier" : "Ajouter"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assets.map((asset) => {
                const value = asset.quantity * asset.currentPrice;
                const cost = asset.quantity * asset.buyPrice;
                const gain = value - cost;
                const gainPercent = ((gain / cost) * 100).toFixed(2);

                return (
                  <div 
                    key={asset.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: `${asset.color}20`, color: asset.color }}
                      >
                        {asset.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {asset.quantity} × {asset.currentPrice.toLocaleString()} €
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium">{value.toLocaleString()} €</p>
                        <p className={cn(
                          "text-sm flex items-center justify-end gap-1",
                          gain >= 0 ? "text-success" : "text-destructive"
                        )}>
                          {gain >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {gain >= 0 ? "+" : ""}{gain.toLocaleString()} € ({gainPercent}%)
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(asset)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(asset.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
