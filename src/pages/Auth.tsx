import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Crown, Zap, Eye, EyeOff, Mail, Lock, User, ArrowRight, BarChart3, PieChart, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import logo from "@/assets/logo.avif";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium">("free");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success(mode === "signup" ? "Compte créé avec succès !" : "Connexion réussie !");
      navigate("/dashboard");
    }, 1000);
  };

  const plans = [
    {
      id: "free" as const,
      name: "Gratuit",
      price: "0€",
      period: "",
      description: "Pour découvrir",
      features: [
        "Dashboard basique",
        "5 objectifs maximum",
        "Suivi budgétaire mensuel",
        "10 actifs en portefeuille",
      ],
    },
    {
      id: "premium" as const,
      name: "Premium",
      price: "4,99€",
      period: "/mois",
      description: "Pour les ambitieux",
      features: [
        "Toutes les fonctionnalités",
        "Objectifs illimités",
        "Analyses & projections avancées",
        "Screener & comparateur d'actions",
        "Export des données",
        "Support prioritaire",
      ],
      popular: true,
    },
  ];

  const features = [
    { icon: BarChart3, title: "Asset Aggregator", desc: "Tous vos actifs synchronisés" },
    { icon: PieChart, title: "Stock Analytics", desc: "Analyses de marché prédictives" },
    { icon: Target, title: "Goal Tracking", desc: "Objectifs financiers en temps réel" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
        
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Riphus" className="h-10 w-10 rounded-xl" />
              <span className="font-display font-bold text-xl tracking-tight">RIPHUS</span>
            </div>
            <nav className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">ANALYSE</a>
              <a href="#" className="hover:text-foreground transition-colors">PORTEFEUILLE</a>
              <a href="#" className="hover:text-foreground transition-colors">TARIFS</a>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit mb-8">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary tracking-wide">IA-POWERED FINANCIAL ENGINE</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl xl:text-6xl font-bold leading-tight mb-6">
              L'intelligence{" "}
              <span className="gradient-text block">Financière</span>
              <span className="text-foreground">réinventée.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Pilotez votre patrimoine avec la précision d'un institutionnel. 
              Riphus analyse vos actions et votre cash-flow en temps réel.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all group"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-muted-foreground">
            © 2026 Riphus. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 bg-card/30">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <img src={logo} alt="Riphus" className="h-10 w-10 rounded-xl" />
            <span className="font-display font-bold text-xl tracking-tight">RIPHUS</span>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-8">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold mb-2">
                {mode === "signin" ? "Bienvenue." : "Créer un compte"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {mode === "signin" 
                  ? "Entrez vos accès pour piloter votre capital."
                  : "Choisissez votre forfait et commencez."
                }
              </p>
            </div>

            {/* Plan Selection (Signup only) */}
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3 mb-6">
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
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <span className="px-2.5 py-1 text-[10px] font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full uppercase tracking-wider">
                          Populaire
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      {plan.id === "premium" ? (
                        <Crown className="h-4 w-4 text-purple-400" />
                      ) : (
                        <Zap className="h-4 w-4 text-primary" />
                      )}
                      <span className="font-semibold text-sm">{plan.name}</span>
                    </div>
                    <div className="mb-1">
                      <span className={cn(
                        "text-xl font-display font-bold",
                        plan.id === "premium" && "gradient-premium"
                      )}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-xs text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{plan.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Plan Features (Signup only) */}
            {mode === "signup" && (
              <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border/50">
                <p className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                  {selectedPlan === "premium" ? "Premium inclut" : "Gratuit inclut"}
                </p>
                <div className="space-y-2">
                  {plans.find(p => p.id === selectedPlan)?.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className={cn(
                        "h-3.5 w-3.5",
                        selectedPlan === "premium" ? "text-purple-400" : "text-primary"
                      )} />
                      <span className="text-muted-foreground text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Nom complet"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-11 h-12 bg-secondary/50 border-border/50 rounded-xl"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email professionnel"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-11 h-12 bg-secondary/50 border-border/50 rounded-xl"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-11 pr-11 h-12 bg-secondary/50 border-border/50 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {mode === "signin" && (
                <div className="text-right">
                  <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                className={cn(
                  "w-full h-12 rounded-xl font-semibold text-sm tracking-wide transition-all",
                  mode === "signup" && selectedPlan === "premium"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    : "bg-foreground text-background hover:bg-foreground/90"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {mode === "signin" ? "Connexion..." : "Création..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === "signin" ? "SE CONNECTER" : selectedPlan === "premium" ? "DÉMARRER PREMIUM" : "COMMENCER GRATUITEMENT"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-xs text-muted-foreground bg-card uppercase tracking-wider">
                  Accès rapide
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="h-11 rounded-xl border-border/50 bg-secondary/30 hover:bg-secondary/50"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                GOOGLE
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="h-11 rounded-xl border-border/50 bg-secondary/30 hover:bg-secondary/50"
              >
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GITHUB
              </Button>
            </div>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <span className="text-sm text-muted-foreground">
                {mode === "signin" ? "Pas encore de compte ?" : "Déjà un compte ?"}
              </span>
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="ml-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                {mode === "signin" ? "S'inscrire" : "Se connecter"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
