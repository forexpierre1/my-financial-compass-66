import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, ArrowUp, ArrowDown, MoreHorizontal, Pencil, Trash2, Calendar, Settings2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, startOfMonth, endOfMonth, isWithinInterval, parse } from "date-fns";
import { fr } from "date-fns/locale";

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

const budgetCategories = ["logement", "alimentation", "transport", "loisirs", "investissement"] as const;

const months = [
  { value: "2025-01", label: "Janvier 2025" },
  { value: "2025-02", label: "Février 2025" },
  { value: "2025-03", label: "Mars 2025" },
  { value: "2025-04", label: "Avril 2025" },
  { value: "2025-05", label: "Mai 2025" },
  { value: "2025-06", label: "Juin 2025" },
  { value: "2025-07", label: "Juillet 2025" },
  { value: "2025-08", label: "Août 2025" },
  { value: "2025-09", label: "Septembre 2025" },
  { value: "2025-10", label: "Octobre 2025" },
  { value: "2025-11", label: "Novembre 2025" },
  { value: "2025-12", label: "Décembre 2025" },
  { value: "2026-01", label: "Janvier 2026" },
];

export default function Budget() {
  const [selectedMonth, setSelectedMonth] = useState("2025-12");
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [budgets, setBudgets] = useState<Record<string, number>>({
    logement: 0,
    alimentation: 0,
    transport: 0,
    loisirs: 0,
    investissement: 0,
  });

  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [tempBudgets, setTempBudgets] = useState(budgets);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "autres",
    date: new Date().toISOString().split('T')[0],
  });

  // Filter transactions by selected month
  const filteredTransactions = useMemo(() => {
    const monthDate = parse(selectedMonth, "yyyy-MM", new Date());
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return isWithinInterval(transactionDate, { start, end });
    });
  }, [transactions, selectedMonth]);

  // Check budget alerts
  const checkBudgetAlerts = () => {
    const expensesByCat = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    Object.entries(budgets).forEach(([category, budget]) => {
      const spent = expensesByCat[category] || 0;
      const percentage = (spent / budget) * 100;
      
      if (spent > budget) {
        toast.error(`Budget ${categoryLabels[category]} dépassé !`, {
          description: `Vous avez dépensé ${spent.toLocaleString()}€ sur un budget de ${budget.toLocaleString()}€`,
        });
      } else if (percentage >= 80) {
        toast.warning(`Budget ${categoryLabels[category]} à ${percentage.toFixed(0)}%`, {
          description: `Attention, vous approchez de la limite`,
        });
      }
    });
  };

  // Check alerts when month or transactions change
  useEffect(() => {
    const timer = setTimeout(() => {
      checkBudgetAlerts();
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedMonth, filteredTransactions.length]);

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

  const handleSaveBudgets = () => {
    setBudgets(tempBudgets);
    setIsBudgetDialogOpen(false);
    toast.success("Budgets mis à jour");
  };

  const totalIncome = filteredTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0";

  const expensesByCategory = filteredTransactions
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

  const selectedMonthLabel = months.find(m => m.value === selectedMonth)?.label || selectedMonth;

  return (
    <DashboardLayout title="Budget" subtitle="Suivez vos revenus et dépenses">
      <div className="space-y-6">
        {/* Month Selector & Budget Settings */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[200px] bg-secondary/50 border-border/50">
                <SelectValue placeholder="Sélectionner un mois" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isBudgetDialogOpen} onOpenChange={(open) => {
            setIsBudgetDialogOpen(open);
            if (open) setTempBudgets(budgets);
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings2 className="h-4 w-4" />
                Gérer les budgets
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Définir vos budgets mensuels</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {budgetCategories.map((category) => (
                  <div key={category} className="flex items-center justify-between gap-4">
                    <Label className="w-32">{categoryLabels[category]}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={tempBudgets[category] || 0}
                        onChange={(e) => setTempBudgets({
                          ...tempBudgets,
                          [category]: parseFloat(e.target.value) || 0
                        })}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">€</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveBudgets} className="w-full">
                Enregistrer
              </Button>
            </DialogContent>
          </Dialog>
        </div>

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
              {filteredTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune transaction pour {selectedMonthLabel}
                </p>
              ) : (
                filteredTransactions.map((transaction) => (
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
                        <DropdownMenuContent align="end" className="bg-card border-border">
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
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
