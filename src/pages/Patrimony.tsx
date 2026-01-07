import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PerformanceChart } from "@/components/PerformanceChart";
import { Plus, Home, Car, CreditCard, Landmark, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface PatrimonyItem {
  id: string;
  name: string;
  type: "asset" | "liability";
  category: string;
  value: number;
}

const assetCategories = [
  { value: "cash", label: "Liquidités", icon: Landmark },
  { value: "investments", label: "Investissements", icon: Landmark },
  { value: "real-estate", label: "Immobilier", icon: Home },
  { value: "vehicles", label: "Véhicules", icon: Car },
  { value: "other-assets", label: "Autres actifs", icon: Landmark },
];

const liabilityCategories = [
  { value: "mortgage", label: "Crédit immobilier", icon: Home },
  { value: "car-loan", label: "Crédit auto", icon: Car },
  { value: "consumer-credit", label: "Crédit conso", icon: CreditCard },
  { value: "other-debts", label: "Autres dettes", icon: CreditCard },
];

const categoryColors: Record<string, string> = {
  cash: "hsl(160 84% 39%)",
  investments: "hsl(199 89% 48%)",
  "real-estate": "hsl(280 80% 55%)",
  vehicles: "hsl(38 92% 50%)",
  "other-assets": "hsl(215 20% 55%)",
  mortgage: "hsl(0 84% 60%)",
  "car-loan": "hsl(0 70% 50%)",
  "consumer-credit": "hsl(0 60% 45%)",
  "other-debts": "hsl(0 50% 40%)",
};

const netWorthHistory: { date: string; value: number }[] = [];

export default function Patrimony() {
  const [items, setItems] = useState<PatrimonyItem[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PatrimonyItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "asset" as "asset" | "liability",
    category: "cash",
    value: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "asset",
      category: "cash",
      value: "",
    });
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: PatrimonyItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      category: formData.category,
      value: parseFloat(formData.value),
    };

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? newItem : i));
      toast.success("Élément modifié");
    } else {
      setItems([...items, newItem]);
      toast.success("Élément ajouté");
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (item: PatrimonyItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      category: item.category,
      value: item.value.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast.success("Élément supprimé");
  };

  const totalAssets = items.filter(i => i.type === "asset").reduce((sum, i) => sum + i.value, 0);
  const totalLiabilities = items.filter(i => i.type === "liability").reduce((sum, i) => sum + i.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const assetsByCategory = items
    .filter(i => i.type === "asset")
    .reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + i.value;
      return acc;
    }, {} as Record<string, number>);

  const waterfallData = [
    { name: "Liquidités", value: assetsByCategory["cash"] || 0, type: "asset" },
    { name: "Investissements", value: assetsByCategory["investments"] || 0, type: "asset" },
    { name: "Immobilier", value: assetsByCategory["real-estate"] || 0, type: "asset" },
    { name: "Véhicules", value: assetsByCategory["vehicles"] || 0, type: "asset" },
    { name: "Dettes", value: -totalLiabilities, type: "liability" },
    { name: "Valeur nette", value: netWorth, type: "total" },
  ];

  const getCategoryLabel = (category: string, type: "asset" | "liability") => {
    const categories = type === "asset" ? assetCategories : liabilityCategories;
    return categories.find(c => c.value === category)?.label || category;
  };

  return (
    <DashboardLayout title="Patrimoine" subtitle="Vue d'ensemble de vos actifs et passifs">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated" className="animate-slide-up">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Actifs</p>
              <p className="text-3xl font-display font-bold text-success">+{totalAssets.toLocaleString()} €</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Passifs</p>
              <p className="text-3xl font-display font-bold text-destructive">-{totalLiabilities.toLocaleString()} €</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Valeur nette</p>
              <p className={cn(
                "text-3xl font-display font-bold",
                netWorth >= 0 ? "text-primary" : "text-destructive"
              )}>
                {netWorth.toLocaleString()} €
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart data={netWorthHistory} title="Évolution de la valeur nette" />
          
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Décomposition du patrimoine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} layout="vertical">
                    <XAxis type="number" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222 47% 8%)',
                        border: '1px solid hsl(222 47% 16%)',
                        borderRadius: '8px',
                        color: 'hsl(210 40% 98%)',
                      }}
                      formatter={(value: number) => [`${Math.abs(value).toLocaleString()} €`, '']}
                    />
                    <Bar dataKey="value" radius={4}>
                      {waterfallData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.type === "liability" 
                              ? "hsl(0 84% 60%)" 
                              : entry.type === "total"
                                ? "hsl(199 89% 48%)"
                                : "hsl(160 84% 39%)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assets & Liabilities Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assets */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-success">Actifs</CardTitle>
              <Dialog open={isDialogOpen && formData.type === "asset"} onOpenChange={(open) => {
                if (open) {
                  setFormData({ ...formData, type: "asset", category: "cash" });
                }
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Modifier" : "Ajouter un actif"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {assetCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value">Valeur (€)</Label>
                      <Input
                        id="value"
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {editingItem ? "Modifier" : "Ajouter"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.filter(i => i.type === "asset").map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${categoryColors[item.category]}20` }}
                      >
                        {item.category === "real-estate" ? (
                          <Home className="h-5 w-5" style={{ color: categoryColors[item.category] }} />
                        ) : item.category === "vehicles" ? (
                          <Car className="h-5 w-5" style={{ color: categoryColors[item.category] }} />
                        ) : (
                          <Landmark className="h-5 w-5" style={{ color: categoryColors[item.category] }} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{getCategoryLabel(item.category, "asset")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium text-success">+{item.value.toLocaleString()} €</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Liabilities */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-destructive">Passifs</CardTitle>
              <Dialog open={isDialogOpen && formData.type === "liability"} onOpenChange={(open) => {
                if (open) {
                  setFormData({ ...formData, type: "liability", category: "mortgage" });
                }
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Modifier" : "Ajouter un passif"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {liabilityCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value">Montant dû (€)</Label>
                      <Input
                        id="value"
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {editingItem ? "Modifier" : "Ajouter"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.filter(i => i.type === "liability").map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-destructive/10">
                        {item.category === "mortgage" ? (
                          <Home className="h-5 w-5 text-destructive" />
                        ) : item.category === "car-loan" ? (
                          <Car className="h-5 w-5 text-destructive" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{getCategoryLabel(item.category, "liability")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium text-destructive">-{item.value.toLocaleString()} €</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                {items.filter(i => i.type === "liability").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Aucun passif enregistré</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
