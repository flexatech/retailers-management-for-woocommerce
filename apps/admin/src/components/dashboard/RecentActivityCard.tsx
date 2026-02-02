import { Edit, MousePointer2, Plus, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const activities = [
  {
    id: 1,
    type: 'click',
    message: 'New click on Amazon for Wireless Headphones Pro',
    time: '2 minutes ago',
  },
  {
    id: 2,
    type: 'add',
    message: 'Best Buy added to Smart Watch Series X',
    time: '15 minutes ago',
  },
  {
    id: 3,
    type: 'edit',
    message: 'Updated retailer URL for Target',
    time: '1 hour ago',
  },
  {
    id: 4,
    type: 'click',
    message: 'New click on Walmart for USB-C Hub Pro',
    time: '2 hours ago',
  },
  {
    id: 5,
    type: 'delete',
    message: 'Removed Newegg from Mechanical Keyboard',
    time: '3 hours ago',
  },
];

const activityIcons: Record<string, { icon: typeof MousePointer2; color: string }> = {
  click: { icon: MousePointer2, color: 'bg-primary/10 text-primary' },
  add: { icon: Plus, color: 'bg-success/10 text-success' },
  edit: { icon: Edit, color: 'bg-warning/10 text-warning' },
  delete: { icon: Trash2, color: 'bg-destructive/10 text-destructive' },
};

export function RecentActivityCard() {
  return (
    <Card
      className="border-border/50 animate-slide-up shadow-sm"
      style={{ animationDelay: '500ms' }}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <CardDescription>Latest actions and events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const { icon: Icon, color } = activityIcons[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={cn('shrink-0 rounded-lg p-2', color)}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground line-clamp-1 text-sm">{activity.message}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
