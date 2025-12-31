import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { ProgressCard } from "@/components/ProgressCard";
import { AllocationChart } from "@/components/AllocationChart";
import { PerformanceChart } from "@/components/PerformanceChart";
import { Wallet, TrendingUp, PiggyBank, Target } from "lucide-react";

const objectives = [
  { id: "1", title: "Investir ce mois", current: 750, target: 1000, unit: "€", status: "on-track" as const },
  { id: "2", title: "Épargne de précaution", current: 4500, target: 5000, unit: "€", status: "on-track" as const },
  { id: "3", title: "Taux d'épargne", current: 18, target: 20, unit: "%", status: "behind" as const },
];

const portfolioAllocation = [
  { name: "Actions", value: 15000, color: "hsl(199 89% 48%)" },
  { name: "ETF", value: 12000, color: "hsl(160 84% 39%)" },
  { name: "Crypto", value: 5000, color: "hsl(280 80% 55%)" },
  { name: "Cash", value: 8000, color: "hsl(38 92% 50%)" },
];

const performanceData = [
  { date: "Jan", value: 35000 },
  { date: "Fév", value: 36500 },
  { date: "Mar", value: 35800 },
  { date: "Avr", value: 38200 },
  { date: "Mai", value: 39500 },
  { date: "Juin", value: 40000 },
  { date: "Juil", value: 42300 },
  { date: "Août", value: 41800 },
  { date: "Sep", value: 43500 },
  { date: "Oct", value: 45200 },
  { date: "Nov", value: 47800 },
  { date: "Déc", value: 50000 },
];

export default function Dashboard() {
  return (
    <DashboardLayout 
      title="Bonjour 👋" 
      subtitle="Voici votre situation financière au 31 décembre 2025"
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Valeur nette"
            value="50 000 €"
            change={12.5}
            changeLabel="cette année"
            icon={PiggyBank}
            delay={0}
          />
          <KPICard
            title="Portefeuille"
            value="40 000 €"
            change={8.3}
            changeLabel="ce mois"
            icon={TrendingUp}
            delay={100}
          />
          <KPICard
            title="Cash disponible"
            value="8 000 €"
            icon={Wallet}
            delay={200}
          />
          <KPICard
            title="Objectifs atteints"
            value="2 / 5"
            icon={Target}
            delay={300}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart 
            data={performanceData} 
            title="Évolution du patrimoine"
          />
          <AllocationChart 
            data={portfolioAllocation} 
            title="Allocation du portefeuille"
          />
        </div>

        {/* Objectives */}
        <ProgressCard objectives={objectives} />
      </div>
    </DashboardLayout>
  );
}
