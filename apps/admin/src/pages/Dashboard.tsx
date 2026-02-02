import {
  Calendar,
  MousePointer2,
  MousePointerClick,
  Package,
  Store,
  TrendingUp,
} from 'lucide-react';

import { ClicksChart } from '@/components/dashboard/ClicksChart';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard';
import { TopProductsCard } from '@/components/dashboard/TopProductsCard';
import { TopRetailersTable } from '@/components/dashboard/TopRetailersTable';

export default function Dashboard() {
  return (
    <div className="mx-auto mt-[84px] max-w-7xl space-y-6 px-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your retailer performance and analytics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Clicks"
          value="12,459"
          change={{ value: '+14.2%', trend: 'up' }}
          icon={MousePointer2}
          iconColor="text-primary"
          delay={0}
        />
        <MetricCard
          title="Active Retailers"
          value="24"
          change={{ value: '+3', trend: 'up' }}
          icon={Store}
          iconColor="text-accent"
          delay={50}
        />
        <MetricCard
          title="Linked Products"
          value="156"
          change={{ value: '+12', trend: 'up' }}
          icon={Package}
          iconColor="text-success"
          delay={100}
        />
        <MetricCard
          title="Conversion Rate"
          value="3.2%"
          change={{ value: '-0.4%', trend: 'down' }}
          icon={TrendingUp}
          iconColor="text-warning"
          delay={150}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ClicksChart />
        </div>
        <div>
          <TopProductsCard />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopRetailersTable />
        </div>
        <div>
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}
