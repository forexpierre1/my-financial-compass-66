import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Crown, Zap, Eye, EyeOff, Mail, Lock, User, ArrowRight, BarChart3, PieChart, Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { RiphusLogo } from "@/components/RiphusLogo";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Global Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[150px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-card/50 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
        </div>
        
        {/* Animated Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-20 w-[400px] h-[400px] rounded-full bg-cyan-500/20 blur-[100px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-40 right-10 w-[350px] h-[350px] rounded-full bg-violet-500/20 blur-[80px]"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Glowing Lines */}
        <motion.div 
          className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-10">
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <RiphusLogo size="md" animated />
            <nav className="flex items-center gap-8 text-sm text-muted-foreground">
              {["ANALYSE", "PORTEFEUILLE", "TARIFS"].map((item, i) => (
                <motion.a 
                  key={item}
                  href="#" 
                  className="hover:text-foreground transition-colors relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-400 transition-all group-hover:w-full" />
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="flex-1 flex flex-col justify-center max-w-xl"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Badge with Glow */}
            <motion.div 
              className="relative inline-flex w-fit mb-8"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-cyan-400/30 blur-xl rounded-full" />
              <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold text-cyan-400 tracking-wide">IA-POWERED FINANCIAL ENGINE</span>
              </div>
            </motion.div>

            {/* Headline with Enhanced Gradient */}
            <motion.h1 
              className="font-display text-5xl xl:text-6xl font-bold leading-[1.1] mb-6"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-foreground">L'intelligence</span>
              <motion.span 
                className="block mt-2 bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: "200% auto" }}
              >
                Financière
              </motion.span>
              <span className="text-foreground">réinventée.</span>
            </motion.h1>

            <motion.p 
              className="text-lg text-muted-foreground leading-relaxed mb-10"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Pilotez votre patrimoine avec la précision d'un institutionnel. 
              Riphus analyse vos actions et votre cash-flow en temps réel.
            </motion.p>

            {/* Feature Cards with Glass Effect */}
            <motion.div 
              className="grid grid-cols-3 gap-4"
              variants={staggerContainer}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="group relative p-4 rounded-xl bg-card/30 backdrop-blur-md border border-white/5 hover:border-cyan-400/30 transition-all duration-300 hover:bg-card/50 overflow-hidden cursor-pointer"
                  variants={scaleIn}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  {/* Card Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative">
                    <motion.div 
                      className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mb-3 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-shadow"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <feature.icon className="h-5 w-5 text-cyan-400" />
                    </motion.div>
                    <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            © 2026 Riphus. Tous droits réservés.
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative">
        {/* Form Background with Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-xl" />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[100px]"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Mobile Logo */}
          <motion.div 
            className="flex justify-center mb-8 lg:hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <RiphusLogo size="lg" />
          </motion.div>

          {/* Form Card with Enhanced Glass Effect */}
          <motion.div 
            className="relative rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Card Glow Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/20 via-violet-500/10 to-purple-500/20 blur-sm" />
            
            <div className="relative rounded-2xl bg-card/90 backdrop-blur-2xl border border-white/10 p-8 shadow-[0_0_60px_rgba(0,0,0,0.4)]">
              {/* Subtle shine effect */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              
              <motion.div 
                className="text-center mb-8"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="font-display text-2xl font-bold mb-2">
                  {mode === "signin" ? "Bienvenue." : "Créer un compte"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {mode === "signin" 
                    ? "Entrez vos accès pour piloter votre capital."
                    : "Choisissez votre forfait et commencez."
                  }
                </p>
              </motion.div>

              {/* Plan Selection (Signup only) */}
              {mode === "signup" && (
                <motion.div 
                  className="grid grid-cols-2 gap-3 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {plans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={cn(
                        "relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden group",
                        selectedPlan === plan.id
                          ? plan.id === "premium"
                            ? "border-violet-500 bg-violet-500/10 shadow-[0_0_35px_rgba(139,92,246,0.25)]"
                            : "border-cyan-400 bg-cyan-400/10 shadow-[0_0_35px_rgba(34,211,238,0.25)]"
                          : "border-border/50 hover:border-muted-foreground bg-secondary/30"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      {/* Glow effect on hover/select */}
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-br transition-opacity",
                        plan.id === "premium" 
                          ? "from-violet-500/10 to-purple-500/10" 
                          : "from-cyan-400/10 to-cyan-500/10",
                        selectedPlan === plan.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                      )} />
                      
                      {plan.popular && (
                        <motion.div 
                          className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.7, type: "spring" }}
                        >
                          <span className="px-2.5 py-1 text-[10px] font-semibold bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full uppercase tracking-wider shadow-[0_0_25px_rgba(139,92,246,0.6)]">
                            Populaire
                          </span>
                        </motion.div>
                      )}
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          {plan.id === "premium" ? (
                            <Crown className="h-4 w-4 text-violet-400" />
                          ) : (
                            <Zap className="h-4 w-4 text-cyan-400" />
                          )}
                          <span className="font-semibold text-sm">{plan.name}</span>
                        </div>
                        <div className="mb-1">
                          <span className={cn(
                            "text-xl font-display font-bold",
                            plan.id === "premium" && "bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent"
                          )}>
                            {plan.price}
                          </span>
                          {plan.period && (
                            <span className="text-xs text-muted-foreground">{plan.period}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{plan.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Selected Plan Features (Signup only) */}
              {mode === "signup" && (
                <motion.div 
                  className="mb-6 p-4 rounded-xl bg-secondary/30 backdrop-blur-sm border border-white/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <p className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                    {selectedPlan === "premium" ? "Premium inclut" : "Gratuit inclut"}
                  </p>
                  <div className="space-y-2">
                    {plans.find(p => p.id === selectedPlan)?.features.slice(0, 4).map((feature, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center gap-2 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                      >
                        <div className={cn(
                          "h-4 w-4 rounded-full flex items-center justify-center",
                          selectedPlan === "premium" ? "bg-violet-500/20" : "bg-cyan-400/20"
                        )}>
                          <Check className={cn(
                            "h-2.5 w-2.5",
                            selectedPlan === "premium" ? "text-violet-400" : "text-cyan-400"
                          )} />
                        </div>
                        <span className="text-muted-foreground text-xs">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <motion.div 
                    className="relative group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-cyan-400 transition-colors" />
                    <Input
                      type="text"
                      placeholder="Nom complet"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-11 h-12 bg-secondary/30 border-white/10 rounded-xl focus:border-cyan-400/50 focus:ring-cyan-400/20 transition-all"
                      required
                    />
                  </motion.div>
                )}

                <motion.div 
                  className="relative group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: mode === "signup" ? 0.6 : 0.4 }}
                >
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-cyan-400 transition-colors" />
                  <Input
                    type="email"
                    placeholder="Email professionnel"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-11 h-12 bg-secondary/30 border-white/10 rounded-xl focus:border-cyan-400/50 focus:ring-cyan-400/20 transition-all"
                    required
                  />
                </motion.div>

                <motion.div 
                  className="relative group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: mode === "signup" ? 0.7 : 0.5 }}
                >
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-cyan-400 transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 pr-11 h-12 bg-secondary/30 border-white/10 rounded-xl focus:border-cyan-400/50 focus:ring-cyan-400/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </motion.div>

                {mode === "signin" && (
                  <motion.div 
                    className="text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <button type="button" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors uppercase tracking-wider">
                      Mot de passe oublié ?
                    </button>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: mode === "signup" ? 0.8 : 0.7 }}
                >
                  <Button 
                    type="submit" 
                    className={cn(
                      "w-full h-12 rounded-xl font-semibold text-sm tracking-wide transition-all relative overflow-hidden group",
                      mode === "signup" && selectedPlan === "premium"
                        ? "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-[0_0_35px_rgba(139,92,246,0.4)]"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    )}
                    disabled={isLoading}
                  >
                    {/* Button shine effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    {isLoading ? (
                      <span className="flex items-center gap-2 relative">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        {mode === "signin" ? "Connexion..." : "Création..."}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 relative">
                        {mode === "signin" ? "SE CONNECTER" : selectedPlan === "premium" ? "DÉMARRER PREMIUM" : "COMMENCER GRATUITEMENT"}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div 
                className="relative my-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-xs text-muted-foreground bg-card/90 uppercase tracking-wider">
                    Accès rapide
                  </span>
                </div>
              </motion.div>

              {/* Social Login */}
              <motion.div 
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1 }}
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-11 rounded-xl border-white/10 bg-secondary/20 hover:bg-secondary/40 hover:border-cyan-400/30 transition-all group"
                >
                  <svg className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
                  className="h-11 rounded-xl border-white/10 bg-secondary/20 hover:bg-secondary/40 hover:border-cyan-400/30 transition-all group"
                >
                  <svg className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GITHUB
                </Button>
              </motion.div>

              {/* Toggle Mode */}
              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                <span className="text-sm text-muted-foreground">
                  {mode === "signin" ? "Pas encore de compte ?" : "Déjà un compte ?"}
                </span>
                <button
                  type="button"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="ml-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {mode === "signin" ? "S'inscrire" : "Se connecter"}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
