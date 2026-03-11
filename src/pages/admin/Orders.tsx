import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Eye } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/SharedComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.getOrders(),
  });

  const orders = Array.isArray(data) ? data : data?.items || data?.orders || [];
  const filtered = orders.filter((o: any) => {
    const matchStatus = statusFilter === "all" || o.orderStatus === statusFilter || o.status === statusFilter;
    const matchSearch = !search || o._id?.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o.shippingAddress?.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Orders" description={`${filtered.length} orders`} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by ID, name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="No orders found" description="No orders match your current filters." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order: any) => (
                <TableRow key={order._id || order.id} className="border-border/50">
                  <TableCell className="font-mono text-sm">{(order._id || order.id)?.slice(-8)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.user?.name || order.shippingAddress?.fullName || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{order.user?.email || order.shippingAddress?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">${order.totalPrice?.toFixed(2) || order.total}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.isPaid || order.paymentStatus === "paid" ? "paid" : "pending"} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.orderStatus || order.status || "processing"} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/orders/${order._id || order.id}`}><Eye className="w-4 h-4" /></Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
