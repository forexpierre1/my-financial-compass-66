import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

interface AllocationChartProps {
  data: AllocationItem[];
  title: string;
  className?: string;
}

export function AllocationChart({ data, title, className }: AllocationChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card variant="elevated" className={cn("animate-slide-up opacity-0", className)} style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
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
          <div className="flex-1 space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{item.value.toLocaleString()} €</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({((item.value / total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
