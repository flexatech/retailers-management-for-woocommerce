import { ExternalLink, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const topRetailers = [
  {
    id: 1,
    name: 'Amazon',
    type: 'Marketplace',
    clicks: 1245,
    change: 12.5,
    products: 45,
    logo: '🛒',
  },
  {
    id: 2,
    name: 'Best Buy',
    type: 'Distributor',
    clicks: 892,
    change: 8.3,
    products: 32,
    logo: '🏪',
  },
  {
    id: 3,
    name: 'Walmart',
    type: 'Marketplace',
    clicks: 756,
    change: -2.1,
    products: 28,
    logo: '🛍️',
  },
  {
    id: 4,
    name: 'Target',
    type: 'Local Dealer',
    clicks: 623,
    change: 15.7,
    products: 19,
    logo: '🎯',
  },
  {
    id: 5,
    name: 'Newegg',
    type: 'Marketplace',
    clicks: 512,
    change: 5.2,
    products: 24,
    logo: '💻',
  },
];

const typeColors: Record<string, string> = {
  Marketplace: 'bg-primary/10 text-primary border-primary/20',
  Distributor: 'bg-accent/10 text-accent border-accent/20',
  'Local Dealer': 'bg-success/10 text-success border-success/20',
};

export function TopRetailersTable() {
  return (
    <Card
      className="border-border/50 animate-slide-up shadow-sm"
      style={{ animationDelay: '300ms' }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Top Retailers</CardTitle>
          <CardDescription>Performance by retailer clicks</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Retailer</TableHead>
              <TableHead className="text-muted-foreground font-medium">Type</TableHead>
              <TableHead className="text-muted-foreground text-right font-medium">Clicks</TableHead>
              <TableHead className="text-muted-foreground text-right font-medium">Change</TableHead>
              <TableHead className="text-muted-foreground text-right font-medium">
                Products
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topRetailers.map((retailer) => (
              <TableRow key={retailer.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg text-lg">
                      {retailer.logo}
                    </div>
                    <span className="font-medium">{retailer.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={typeColors[retailer.type]}>
                    {retailer.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {retailer.clicks.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className={`flex items-center justify-end gap-1 ${
                      retailer.change >= 0 ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    <TrendingUp
                      className={`h-3.5 w-3.5 ${retailer.change < 0 ? 'rotate-180' : ''}`}
                    />
                    <span className="font-medium">{Math.abs(retailer.change)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-right">
                  {retailer.products}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
