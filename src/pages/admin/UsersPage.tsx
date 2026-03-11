import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users as UsersIcon, Search, Shield, Ban } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/SharedComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.getUsers(),
  });

  const users = Array.isArray(data) ? data : data?.items || data?.users || [];
  const filtered = users.filter((u: any) =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Users" description={`${filtered.length} registered users`} />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading users...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No users found" description="No users match your search." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user: any) => (
                <TableRow key={user._id || user.id} className="border-border/50">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">{user.phone || "N/A"}</TableCell>
                  <TableCell><StatusBadge status={user.isAdmin || user.role === "admin" ? "Admin" : "Customer"} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toast.info("Promote user functionality")} className="text-xs">
                        <Shield className="w-3.5 h-3.5 mr-1" /> Promote
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toast.info("Deactivate user functionality")} className="text-xs text-destructive">
                        <Ban className="w-3.5 h-3.5 mr-1" /> Deactivate
                      </Button>
                    </div>
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
