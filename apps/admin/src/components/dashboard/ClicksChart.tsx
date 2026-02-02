import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  { name: 'Mon', clicks: 240 },
  { name: 'Tue', clicks: 139 },
  { name: 'Wed', clicks: 980 },
  { name: 'Thu', clicks: 390 },
  { name: 'Fri', clicks: 480 },
  { name: 'Sat', clicks: 380 },
  { name: 'Sun', clicks: 430 },
];

export function ClicksChart() {
  return (
    <div
      className="bg-card border-border shadow-card animate-slide-up rounded-xl border p-6"
      style={{ animationDelay: '0.1s' }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-foreground font-semibold">Clicks Over Time</h3>
          <p className="text-muted-foreground text-sm">Last 7 days</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-muted text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-xs font-medium transition-colors">
            Daily
          </button>
          <button className="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-xs font-medium">
            Weekly
          </button>
          <button className="bg-muted text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-xs font-medium transition-colors">
            Monthly
          </button>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(175, 60%, 35%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(175, 60%, 35%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(215, 20%, 88%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="hsl(175, 60%, 35%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorClicks)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
