import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { PageHeader } from "@/components/admin/SharedComponents";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const timeRanges = [
  { label: "7D", value: 7 },
  { label: "30D", value: 30 },
  { label: "90D", value: 90 },
  { label: "1Y", value: 365 },
];

const tooltipStyle = { background: "hsl(240, 6%, 6%)", border: "1px solid hsl(240, 3.7%, 15.9%)", borderRadius: 8, fontSize: 13 };

function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 h-[340px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Analytics() {
  const [range, setRange] = useState(30);
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics", range],
    queryFn: () => api.getAnalytics(range),
  });
  const data: any[] = analyticsData?.timeSeries || [];
  const topProducts: any[] = analyticsData?.topProducts || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Analytics" description="Deep dive into your platform performance">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50">
          {timeRanges.map((t) => (
            <Button
              key={t.value}
              variant={range === t.value ? "default" : "ghost"}
              size="sm"
              className="text-xs px-3"
              onClick={() => setRange(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => <ChartSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h3 className="font-semibold mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3.7%, 15.9%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(240, 5%, 64.9%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(240, 5%, 64.9%)" />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(217, 91%, 60%)" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Orders */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h3 className="font-semibold mb-4">Orders Over Time</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3.7%, 15.9%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(240, 5%, 64.9%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(240, 5%, 64.9%)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="orders" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h3 className="font-semibold mb-4">Top 10 Products</h3>
            {topProducts.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3.7%, 15.9%)" />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(240, 5%, 64.9%)" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="hsl(240, 5%, 64.9%)" width={120} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="sales" fill="hsl(280, 65%, 60%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Customer Growth */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h3 className="font-semibold mb-4">Customer Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="usr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3.7%, 15.9%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(240, 5%, 64.9%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(240, 5%, 64.9%)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="users" stroke="hsl(38, 92%, 50%)" fill="url(#usr)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
