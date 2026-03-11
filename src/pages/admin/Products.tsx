import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2, Package, Upload, Download } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/SharedComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["products", page],
    queryFn: () => api.getProducts(`page=${page}&limit=20`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); toast.success("Product deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkImportMutation = useMutation({
    mutationFn: (file: File) => api.bulkImportProducts(file),
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Imported ${result.imported ?? ""} products${result.skipped ? `, ${result.skipped} skipped` : ""}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) { toast.error("Please upload a .csv file"); return; }
    bulkImportMutation.mutate(file);
    e.target.value = "";
  }

  function downloadTemplate() {
    const headers = ["name", "description", "price", "category", "brand", "stock", "images", "tags"];
    const example = ["Racing Helmet Pro", "Full-face motorcycle helmet", "199.99", "Helmets", "RacePro", "50", "https://example.com/img.jpg", "helmet,racing"];
    const csv = [headers.join(","), example.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const products = Array.isArray(data) ? data : data?.items || data?.products || [];
  const filtered = products.filter((p: any) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    return matchSearch && matchCategory;
  });

  const categories = [...new Set(products.map((p: any) => p.category).filter(Boolean))] as string[];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Products" description={`${filtered.length} products`}>
        <Button variant="outline" size="sm" onClick={downloadTemplate}>
          <Download className="w-4 h-4 mr-2" />CSV Template
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={bulkImportMutation.isPending}
        >
          <Upload className="w-4 h-4 mr-2" />
          {bulkImportMutation.isPending ? "Importing…" : "Upload CSV"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button asChild>
          <Link to="/admin/products/new"><Plus className="w-4 h-4 mr-2" />Add Product</Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading products...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Package} title="No products found" description="Try adjusting your search or filters." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-12">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product: any) => (
                <TableRow key={product._id || product.id} className="border-border/50">
                  <TableCell>
                    <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                      {(product.image || product.images?.[0]) ? (
                        <img src={product.image || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-muted-foreground" /></div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell><span className="text-muted-foreground">{product.category}</span></TableCell>
                  <TableCell className="font-mono">${product.price}</TableCell>
                  <TableCell>
                    <StatusBadge status={product.stockQuantity > 10 || product.stock > 10 ? "In Stock" : (product.stockQuantity ?? product.stock ?? 0) > 0 ? "Low Stock" : "Out of Stock"} />
                    <span className="ml-2 text-sm text-muted-foreground">{product.stockQuantity ?? product.stock ?? product.countInStock ?? 0}</span>
                  </TableCell>
                  <TableCell>⭐ {product.rating?.toFixed(1) || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild><Link to={`/admin/products/${product._id || product.id}`}><Eye className="w-4 h-4" /></Link></Button>
                      <Button variant="ghost" size="icon" asChild><Link to={`/admin/products/${product._id || product.id}`}><Pencil className="w-4 h-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(product._id || product.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Previous</Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
