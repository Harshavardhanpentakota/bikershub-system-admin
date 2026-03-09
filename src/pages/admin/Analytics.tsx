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

function generateData(days: number) {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Math.floor(Math.random() * 8000) + 1000,
    orders: Math.floor(Math.random() * 60) + 5,
    users: Math.floor(Math.random() * 20) + 2,
  }));
}

const topProducts = [
  { name: "Racing Helmet Pro", sales: 245 },
  { name: "Leather Riding Gloves", sales: 198 },
  { name: "Tank Bag Deluxe", sales: 176 },
  { name: "Knee Guards Set", sales: 154 },
  { name: "Bluetooth Headset", sales: 143 },
  { name: "Chain Lube Kit", sales: 132 },
  { name: "Riding Jacket", sales: 121 },
  { name: "Phone Mount", sales: 108 },
  { name: "Tail Light LED", sales: 97 },
  { name: "Handlebar Grips", sales: 89 },
];

const tooltipStyle = { background: "hsl(240, 6%, 6%)", border: "1px solid hsl(240, 3.7%, 15.9%)", borderRadius: 8, fontSize: 13 };

export default function Analytics() {
  const [range, setRange] = useState(30);
  const data = generateData(range);

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
              <Tooltip contentStyle={tooltipStyle} />
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3.7%, 15.9%)" />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(240, 5%, 64.9%)" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="hsl(240, 5%, 64.9%)" width={120} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="sales" fill="hsl(280, 65%, 60%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
    </div>
  );
}
