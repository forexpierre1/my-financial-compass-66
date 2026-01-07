import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { ProgressCard } from "@/components/ProgressCard";
import { AllocationChart } from "@/components/AllocationChart";
import { PerformanceChart } from "@/components/PerformanceChart";
import { Wallet, TrendingUp, PiggyBank, Target } from "lucide-react";

const objectives: { id: string; title: string; current: number; target: number; unit: string; status: "on-track" | "behind" | "completed" }[] = [];

const portfolioAllocation: { name: string; value: number; color: string }[] = [];

const performanceData: { date: string; value: number }[] = [];

export default function Dashboard() {
  return (
    <DashboardLayout 
      title="Bonjour 👋" 
      subtitle="Voici votre situation financière"
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Valeur nette"
            value="0 €"
            icon={PiggyBank}
            delay={0}
          />
          <KPICard
            title="Portefeuille"
            value="0 €"
            icon={TrendingUp}
            delay={100}
          />
          <KPICard
            title="Cash disponible"
            value="0 €"
            icon={Wallet}
            delay={200}
          />
          <KPICard
            title="Objectifs atteints"
            value="0 / 0"
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
