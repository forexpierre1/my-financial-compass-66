import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, ArrowUp, ArrowDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

const categoryColors: Record<string, string> = {
  salaire: "hsl(160 84% 39%)",
  logement: "hsl(199 89% 48%)",
  alimentation: "hsl(38 92% 50%)",
  transport: "hsl(280 80% 55%)",
  loisirs: "hsl(320 85% 55%)",
  investissement: "hsl(160 84% 39%)",
  autres: "hsl(215 20% 55%)",
};

const categoryLabels: Record<string, string> = {
  salaire: "Salaire",
  logement: "Logement",
  alimentation: "Alimentation",
  transport: "Transport",
  loisirs: "Loisirs",
  investissement: "Investissement",
  autres: "Autres",
};

export default function Budget() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", description: "Salaire", amount: 3500, type: "income", category: "salaire", date: "2025-12-01" },
    { id: "2", description: "Loyer", amount: 900, type: "expense", category: "logement", date: "2025-12-05" },
    { id: "3", description: "Courses", amount: 350, type: "expense", category: "alimentation", date: "2025-12-10" },
    { id: "4", description: "Abonnement transport", amount: 80, type: "expense", category: "transport", date: "2025-12-01" },
    { id: "5", description: "Netflix + Spotify", amount: 25, type: "expense", category: "loisirs", date: "2025-12-01" },
    { id: "6", description: "Investissement ETF", amount: 500, type: "expense", category: "investissement", date: "2025-12-15" },
  ]);

  const [budgets] = useState({
    logement: 1000,
    alimentation: 400,
    transport: 100,
    loisirs: 200,
    investissement: 600,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "autres",
    date: new Date().toISOString().split('T')[0],
  });

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category: "autres",
      date: new Date().toISOString().split('T')[0],
    });
    setEditingTransaction(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTransaction: Transaction = {
      id: editingTransaction?.id || Date.now().toString(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
    };

    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? newTransaction : t));
      toast.success("Transaction modifiée");
    } else {
      setTransactions([newTransaction, ...transactions]);
      toast.success("Transaction ajoutée");
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success("Transaction supprimée");
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0";

  const expensesByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([category, value]) => ({
    name: categoryLabels[category] || category,
    value,
    color: categoryColors[category] || categoryColors.autres,
  }));

  const barData = Object.entries(budgets).map(([category, budget]) => ({
    category: categoryLabels[category],
    budget,
    spent: expensesByCategory[category] || 0,
  }));

  return (
    <DashboardLayout title="Budget" subtitle="Suivez vos revenus et dépenses">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="elevated" className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="h-4 w-4 text-success" />
                <p className="text-sm text-muted-foreground">Revenus</p>
              </div>
              <p className="text-2xl font-display font-bold text-success">+{totalIncome.toLocaleString()} €</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDown className="h-4 w-4 text-destructive" />
                <p className="text-sm text-muted-foreground">Dépenses</p>
              </div>
              <p className="text-2xl font-display font-bold text-destructive">-{totalExpenses.toLocaleString()} €</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Reste à vivre</p>
              <p className={cn(
                "text-2xl font-display font-bold",
                balance >= 0 ? "text-success" : "text-destructive"
              )}>
                {balance >= 0 ? "+" : ""}{balance.toLocaleString()} €
              </p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Taux d'épargne</p>
              <p className="text-2xl font-display font-bold text-primary">{savingsRate}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Budget vs Réel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <XAxis type="number" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
                    <YAxis type="category" dataKey="category" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222 47% 8%)',
                        border: '1px solid hsl(222 47% 16%)',
                        borderRadius: '8px',
                        color: 'hsl(210 40% 98%)',
                      }}
                    />
                    <Bar dataKey="budget" fill="hsl(222 47% 20%)" name="Budget" radius={4} />
                    <Bar dataKey="spent" fill="hsl(199 89% 48%)" name="Dépensé" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Répartition des dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="h-48 w-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(222 47% 8%)',
                          border: '1px solid hsl(222 47% 16%)',
                          borderRadius: '8px',
                          color: 'hsl(210 40% 98%)',
                        }}
                        formatter={(value: number) => [`${value.toLocaleString()} €`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value.toLocaleString()} €</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Suivi des budgets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(budgets).map(([category, budget]) => {
              const spent = expensesByCategory[category] || 0;
              const percentage = Math.min(100, (spent / budget) * 100);
              const isOverBudget = spent > budget;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{categoryLabels[category]}</span>
                    <span className={cn(
                      "text-sm",
                      isOverBudget ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {spent.toLocaleString()} € / {budget.toLocaleString()} €
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={cn(
                      "h-2 bg-secondary",
                      isOverBudget ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"
                    )}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transactions récentes</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingTransaction ? "Modifier" : "Ajouter une transaction"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Montant (€)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: "income" | "expense") => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Revenu</SelectItem>
                          <SelectItem value="expense">Dépense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                          {Object.entries(categoryLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingTransaction ? "Modifier" : "Ajouter"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      transaction.type === "income" ? "bg-success/10" : "bg-secondary"
                    )}>
                      {transaction.type === "income" ? (
                        <ArrowUp className="h-5 w-5 text-success" />
                      ) : (
                        <ArrowDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {categoryLabels[transaction.category]} • {new Date(transaction.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={cn(
                      "font-medium",
                      transaction.type === "income" ? "text-success" : "text-foreground"
                    )}>
                      {transaction.type === "income" ? "+" : "-"}{transaction.amount.toLocaleString()} €
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(transaction.id)}
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
      </div>
    </DashboardLayout>
  );
}
