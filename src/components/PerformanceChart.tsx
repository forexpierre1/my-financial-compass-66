import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface PerformanceDataPoint {
  date: string;
  value: number;
}

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
  title: string;
  className?: string;
}

export function PerformanceChart({ data, title, className }: PerformanceChartProps) {
  return (
    <Card variant="elevated" className={cn("animate-slide-up opacity-0", className)} style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222 47% 8%)',
                  border: '1px solid hsl(222 47% 16%)',
                  borderRadius: '8px',
                  color: 'hsl(210 40% 98%)',
                }}
                formatter={(value: number) => [`${value.toLocaleString()} €`, 'Valeur']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(199 89% 48%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
