import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, CheckCircle2, Clock, AlertCircle, MoreHorizontal, Pencil, Trash2, TrendingUp } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Objective {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  category: "savings" | "investment" | "debt" | "income" | "other";
}

const priorityColors = {
  high: "text-destructive",
  medium: "text-warning",
  low: "text-muted-foreground",
};

const priorityLabels = {
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

const categoryLabels = {
  savings: "Épargne",
  investment: "Investissement",
  debt: "Remboursement",
  income: "Revenus",
  other: "Autre",
};

const categoryIcons = {
  savings: "💰",
  investment: "📈",
  debt: "💳",
  income: "💵",
  other: "🎯",
};

export default function Objectives() {
  const [objectives, setObjectives] = useState<Objective[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    current: "",
    target: "",
    unit: "€",
    deadline: "",
    priority: "medium" as Objective["priority"],
    category: "savings" as Objective["category"],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      current: "",
      target: "",
      unit: "€",
      deadline: "",
      priority: "medium",
      category: "savings",
    });
    setEditingObjective(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newObjective: Objective = {
      id: editingObjective?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      current: parseFloat(formData.current),
      target: parseFloat(formData.target),
      unit: formData.unit,
      deadline: formData.deadline,
      priority: formData.priority,
      category: formData.category,
    };

    if (editingObjective) {
      setObjectives(objectives.map(o => o.id === editingObjective.id ? newObjective : o));
      toast.success("Objectif modifié");
    } else {
      setObjectives([...objectives, newObjective]);
      toast.success("Objectif ajouté");
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (objective: Objective) => {
    setEditingObjective(objective);
    setFormData({
      title: objective.title,
      description: objective.description,
      current: objective.current.toString(),
      target: objective.target.toString(),
      unit: objective.unit,
      deadline: objective.deadline,
      priority: objective.priority,
      category: objective.category,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setObjectives(objectives.filter(o => o.id !== id));
    toast.success("Objectif supprimé");
  };

  const getStatus = (objective: Objective) => {
    const percentage = (objective.current / objective.target) * 100;
    const deadline = new Date(objective.deadline);
    const now = new Date();
    const totalDays = (deadline.getTime() - new Date("2025-01-01").getTime()) / (1000 * 60 * 60 * 24);
    const elapsedDays = (now.getTime() - new Date("2025-01-01").getTime()) / (1000 * 60 * 60 * 24);
    const expectedProgress = (elapsedDays / totalDays) * 100;

    if (percentage >= 100) return "completed";
    if (percentage >= expectedProgress * 0.9) return "on-track";
    return "behind";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "on-track":
        return <Clock className="h-5 w-5 text-primary" />;
      case "behind":
        return <AlertCircle className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Atteint";
      case "on-track":
        return "En bonne voie";
      case "behind":
        return "En retard";
    }
  };

  const completedCount = objectives.filter(o => getStatus(o) === "completed").length;
  const onTrackCount = objectives.filter(o => getStatus(o) === "on-track").length;
  const behindCount = objectives.filter(o => getStatus(o) === "behind").length;

  return (
    <DashboardLayout title="Objectifs" subtitle="Suivez vos objectifs financiers">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="elevated" className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Total objectifs</p>
              </div>
              <p className="text-3xl font-display font-bold">{objectives.length}</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="text-sm text-muted-foreground">Atteints</p>
              </div>
              <p className="text-3xl font-display font-bold text-success">{completedCount}</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">En bonne voie</p>
              </div>
              <p className="text-3xl font-display font-bold text-primary">{onTrackCount}</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <p className="text-sm text-muted-foreground">En retard</p>
              </div>
              <p className="text-3xl font-display font-bold text-warning">{behindCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Objectives List */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mes objectifs</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel objectif
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingObjective ? "Modifier l'objectif" : "Nouvel objectif"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Épargner 10 000€"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Pourquoi cet objectif ?"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current">Actuel</Label>
                      <Input
                        id="current"
                        type="number"
                        step="any"
                        value={formData.current}
                        onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target">Objectif</Label>
                      <Input
                        id="target"
                        type="number"
                        step="any"
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unité</Label>
                      <Select
                        value={formData.unit}
                        onValueChange={(value) => setFormData({ ...formData, unit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="€">€</SelectItem>
                          <SelectItem value="%">%</SelectItem>
                          <SelectItem value="mois">mois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Échéance</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priorité</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: Objective["priority"]) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Haute</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="low">Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: Objective["category"]) => setFormData({ ...formData, category: value })}
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
                  </div>
                  <Button type="submit" className="w-full">
                    {editingObjective ? "Modifier" : "Créer l'objectif"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {objectives.map((objective) => {
                const percentage = Math.min(100, (objective.current / objective.target) * 100);
                const status = getStatus(objective);
                const remaining = objective.target - objective.current;

                return (
                  <div 
                    key={objective.id}
                    className="p-5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">{categoryIcons[objective.category]}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{objective.title}</h3>
                            <span className={cn("text-xs", priorityColors[objective.priority])}>
                              • {priorityLabels[objective.priority]}
                            </span>
                          </div>
                          {objective.description && (
                            <p className="text-sm text-muted-foreground mb-2">{objective.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(status)}
                              <span className={cn(
                                status === "completed" && "text-success",
                                status === "on-track" && "text-primary",
                                status === "behind" && "text-warning"
                              )}>
                                {getStatusLabel(status)}
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              Échéance: {new Date(objective.deadline).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(objective)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(objective.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          <span className="font-medium">{objective.current.toLocaleString()}</span>
                          <span className="text-muted-foreground"> / {objective.target.toLocaleString()} {objective.unit}</span>
                        </span>
                        <span className="font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={cn(
                          "h-2 bg-muted",
                          status === "completed" && "[&>div]:bg-success",
                          status === "on-track" && "[&>div]:bg-primary",
                          status === "behind" && "[&>div]:bg-warning"
                        )}
                      />
                      {status !== "completed" && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Il reste {remaining.toLocaleString()} {objective.unit} à atteindre
                        </p>
                      )}
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
