import { ExternalLink, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const topProducts = [
  { id: 1, name: 'Wireless Headphones Pro', clicks: 892, maxClicks: 1000, retailers: 5 },
  { id: 2, name: 'Smart Watch Series X', clicks: 756, maxClicks: 1000, retailers: 4 },
  { id: 3, name: 'Bluetooth Speaker Mini', clicks: 623, maxClicks: 1000, retailers: 6 },
  { id: 4, name: 'USB-C Hub Pro', clicks: 512, maxClicks: 1000, retailers: 3 },
  { id: 5, name: 'Mechanical Keyboard', clicks: 445, maxClicks: 1000, retailers: 4 },
];

export function TopProductsCard() {
  return (
    <Card
      className="border-border/50 animate-slide-up shadow-sm"
      style={{ animationDelay: '400ms' }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Top Products</CardTitle>
          <CardDescription>Most clicked products this month</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {topProducts.map((product, index) => (
            <div key={product.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-muted-foreground text-xs">{product.retailers} retailers</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">{product.clicks.toLocaleString()}</span>
              </div>
              <Progress value={(product.clicks / product.maxClicks) * 100} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
