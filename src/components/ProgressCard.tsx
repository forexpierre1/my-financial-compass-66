import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface Objective {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  status: "on-track" | "behind" | "completed";
}

interface ProgressCardProps {
  objectives: Objective[];
  className?: string;
}

export function ProgressCard({ objectives, className }: ProgressCardProps) {
  const getStatusIcon = (status: Objective["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "on-track":
        return <Clock className="h-4 w-4 text-primary" />;
      case "behind":
        return <AlertCircle className="h-4 w-4 text-warning" />;
    }
  };

  const getProgressColor = (status: Objective["status"]) => {
    switch (status) {
      case "completed":
        return "[&>div]:bg-success";
      case "on-track":
        return "[&>div]:bg-primary";
      case "behind":
        return "[&>div]:bg-warning";
    }
  };

  return (
    <Card variant="elevated" className={cn("animate-slide-up opacity-0", className)} style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Objectifs du mois
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {objectives.map((objective) => {
          const percentage = Math.min(100, (objective.current / objective.target) * 100);
          return (
            <div key={objective.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(objective.status)}
                  <span className="text-sm font-medium">{objective.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {objective.current.toLocaleString()} / {objective.target.toLocaleString()} {objective.unit}
                </span>
              </div>
              <Progress 
                value={percentage} 
                className={cn("h-2 bg-secondary", getProgressColor(objective.status))}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
