import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: 'up' | 'down';
  };
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-primary',
  delay = 0,
}: MetricCardProps) {
  return (
    <Card
      className="border-border/50 animate-slide-up p-4 shadow-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                change.trend === 'up' ? 'text-success' : 'text-destructive',
              )}
            >
              {change.trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{change.value}</span>
              <span className="text-muted-foreground font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn('bg-muted/50 rounded-xl p-3', iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
