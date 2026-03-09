import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, BarChart3 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { StatsCard, PageHeader } from "@/components/admin/SharedComponents";
import { api } from "@/lib/api";

// Mock data for charts (would be computed from API data)
const revenueData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  revenue: Math.floor(Math.random() * 5000) + 2000,
  orders: Math.floor(Math.random() * 50) + 10,
}));

const categoryData = [
  { name: "Helmets", value: 35 },
  { name: "Gloves", value: 20 },
  { name: "Jackets", value: 25 },
  { name: "Accessories", value: 15 },
  { name: "Parts", value: 5 },
];

const COLORS = ["hsl(217, 91%, 60%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(280, 65%, 60%)", "hsl(350, 80%, 55%)"];

export default function Dashboard() {
  const { data: products } = useQuery({ queryKey: ["products"], queryFn: () => api.getProducts() });
  const { data: orders } = useQuery({ queryKey: ["orders"], queryFn: () => api.getOrders() });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => api.getUsers() });

  const totalProducts = Array.isArray(products) ? products.length : products?.products?.length || 0;
  const totalOrders = Array.isArray(orders) ? orders.length : orders?.orders?.length || 0;
  const totalUsers = Array.isArray(users) ? users.length : users?.users?.length || 0;
  const totalRevenue = 128450;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : "0";

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Dashboard" description="Overview of your BikersHub platform" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change="+12.5%" changeType="positive" icon={DollarSign} description="vs last month" />
        <StatsCard title="Total Orders" value={totalOrders} change="+8.2%" changeType="positive" icon={ShoppingCart} description="vs last month" />
        <StatsCard title="Total Users" value={totalUsers} change="+15.3%" changeType="positive" icon={Users} description="vs last month" />
        <StatsCard title="Total Products" value={totalProducts} change="+3" changeType="positive" icon={Package} description="new this month" />
        <StatsCard title="Avg. Order Value" value={`$${avgOrderValue}`} change="+4.1%" changeType="positive" icon={TrendingUp} />
        <StatsCard title="Conversion Rate" value="3.2%" change="+0.4%" changeType="positive" icon={BarChart3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card p-5">
          <h3 className="font-semibold mb-4">Revenue (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3.7%, 15.9%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(240, 5%, 64.9%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(240, 5%, 64.9%)" />
              <Tooltip contentStyle={{ background: "hsl(240, 6%, 6%)", border: "1px solid hsl(240, 3.7%, 15.9%)", borderRadius: 8, fontSize: 13 }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(217, 91%, 60%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <h3 className="font-semibold mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={4}>
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(240, 6%, 6%)", border: "1px solid hsl(240, 3.7%, 15.9%)", borderRadius: 8, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders per day */}
      <div className="rounded-xl border border-border/50 bg-card p-5">
        <h3 className="font-semibold mb-4">Orders per Day</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={revenueData.slice(0, 14)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3.7%, 15.9%)" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(240, 5%, 64.9%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(240, 5%, 64.9%)" />
            <Tooltip contentStyle={{ background: "hsl(240, 6%, 6%)", border: "1px solid hsl(240, 3.7%, 15.9%)", borderRadius: 8, fontSize: 13 }} />
            <Bar dataKey="orders" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
