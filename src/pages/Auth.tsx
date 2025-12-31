import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Check, Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium">("free");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate auth - will be replaced with Supabase
    setTimeout(() => {
      setIsLoading(false);
      toast.success(isSignUp ? "Compte créé avec succès !" : "Connexion réussie !");
      navigate("/dashboard");
    }, 1000);
  };

  const plans = [
    {
      id: "free" as const,
      name: "Freemium",
      price: "0€",
      description: "Pour démarrer",
      features: [
        "Dashboard basique",
        "5 objectifs max",
        "Budget mensuel",
        "10 actifs dans le portefeuille",
      ],
    },
    {
      id: "premium" as const,
      name: "Premium",
      price: "9.99€",
      period: "/mois",
      description: "Pour les ambitieux",
      features: [
        "Toutes les fonctionnalités",
        "Objectifs illimités",
        "Analyses avancées",
        "Projections à long terme",
        "Export des données",
        "Support prioritaire",
      ],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(222 47% 8%) 0%, hsl(222 47% 4%) 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-success/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl">WealthPilot</h1>
              <p className="text-sm text-muted-foreground">Pilotez votre argent</p>
            </div>
          </div>
          
          <h2 className="font-display text-4xl font-bold mb-4">
            Prenez le contrôle de votre{" "}
            <span className="gradient-text">avenir financier</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Suivez vos objectifs, gérez votre budget, et construisez votre patrimoine avec une vision claire de votre trajectoire financière.
          </p>
          
          <div className="space-y-4">
            {[
              "Dashboard intelligent avec KPIs en temps réel",
              "Suivi de vos objectifs et progression",
              "Gestion complète du portefeuille",
              "Analyse de votre patrimoine net",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl">WealthPilot</h1>
          </div>

          <Tabs defaultValue="signin" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="font-display text-2xl font-bold">Bon retour !</h2>
                <p className="text-muted-foreground">Connectez-vous à votre compte</p>
              </div>
              
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="font-display text-2xl font-bold">Créer un compte</h2>
                <p className="text-muted-foreground">Commencez gratuitement</p>
              </div>

              {/* Plan Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cn(
                      "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                      selectedPlan === plan.id
                        ? plan.id === "premium"
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-primary bg-primary/10"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Populaire
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      {plan.id === "premium" ? (
                        <Crown className="h-4 w-4 text-purple-400" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-primary" />
                      )}
                      <span className="font-medium">{plan.name}</span>
                    </div>
                    <div className="mb-2">
                      <span className={cn(
                        "text-2xl font-display font-bold",
                        plan.id === "premium" && "gradient-premium"
                      )}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                ))}
              </div>

              {/* Selected Plan Features */}
              <Card variant="glass" className="mb-6">
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-3">
                    {selectedPlan === "premium" ? "Premium inclut :" : "Gratuit inclut :"}
                  </p>
                  <div className="space-y-2">
                    {plans.find(p => p.id === selectedPlan)?.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className={cn(
                          "h-4 w-4",
                          selectedPlan === "premium" ? "text-purple-400" : "text-primary"
                        )} />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nom</Label>
                  <Input
                    id="signup-name"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant={selectedPlan === "premium" ? "premium" : "default"}
                  disabled={isLoading}
                >
                  {isLoading ? "Création..." : selectedPlan === "premium" ? "Démarrer Premium" : "Créer mon compte gratuit"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
