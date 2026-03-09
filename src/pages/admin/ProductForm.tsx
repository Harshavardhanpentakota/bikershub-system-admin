import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/admin/SharedComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id && id !== "new";

  const { data: existingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id!),
    enabled: isEdit,
  });

  const product = existingProduct?.product || existingProduct;

  const [form, setForm] = useState<any>({
    name: "", price: "", originalPrice: "", discountPercentage: "", category: "",
    sizes: "", colors: "", compatibleBikes: "", description: "", specifications: "",
    countInStock: "", images: [],
  });

  // Populate form when editing
  useState(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        discountPercentage: product.discountPercentage || "",
        category: product.category || "",
        sizes: product.sizes?.join(", ") || "",
        colors: product.colors?.join(", ") || "",
        compatibleBikes: product.compatibleBikes?.join(", ") || "",
        description: product.description || "",
        specifications: JSON.stringify(product.specifications || {}),
        countInStock: product.countInStock || product.stock || "",
        images: product.images || [],
      });
    }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? api.updateProduct(id!, data) : api.createProduct(data),
    onSuccess: () => { toast.success(isEdit ? "Product updated" : "Product created"); navigate("/admin/products"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      discountPercentage: Number(form.discountPercentage),
      countInStock: Number(form.countInStock),
      sizes: form.sizes.split(",").map((s: string) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s: string) => s.trim()).filter(Boolean),
      compatibleBikes: form.compatibleBikes.split(",").map((s: string) => s.trim()).filter(Boolean),
    };
    mutation.mutate(payload);
  };

  const updateField = (field: string, value: any) => setForm((f: any) => ({ ...f, [field]: value }));

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <PageHeader title={isEdit ? "Edit Product" : "New Product"} description={isEdit ? "Update product details" : "Add a new product to your store"} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
          <h3 className="font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label>Product Name</Label>
              <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Product name" required />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <Label>Original Price</Label>
              <Input type="number" value={form.originalPrice} onChange={(e) => updateField("originalPrice", e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Discount %</Label>
              <Input type="number" value={form.discountPercentage} onChange={(e) => updateField("discountPercentage", e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="Helmets, Gloves, etc." required />
            </div>
            <div className="space-y-2">
              <Label>Stock Quantity</Label>
              <Input type="number" value={form.countInStock} onChange={(e) => updateField("countInStock", e.target.value)} placeholder="0" required />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
          <h3 className="font-semibold">Details</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={4} placeholder="Product description..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Sizes (comma separated)</Label>
                <Input value={form.sizes} onChange={(e) => updateField("sizes", e.target.value)} placeholder="S, M, L, XL" />
              </div>
              <div className="space-y-2">
                <Label>Colors (comma separated)</Label>
                <Input value={form.colors} onChange={(e) => updateField("colors", e.target.value)} placeholder="Black, Red, Blue" />
              </div>
              <div className="space-y-2">
                <Label>Compatible Bikes</Label>
                <Input value={form.compatibleBikes} onChange={(e) => updateField("compatibleBikes", e.target.value)} placeholder="Royal Enfield, KTM" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Specifications (JSON)</Label>
              <Textarea value={form.specifications} onChange={(e) => updateField("specifications", e.target.value)} rows={3} placeholder='{"material": "leather", "weight": "500g"}' />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
          <h3 className="font-semibold">Images</h3>
          <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 text-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag and drop images or click to upload</p>
            <Input type="file" multiple accept="image/*" className="max-w-xs" onChange={(e) => {
              // Handle file upload - would integrate with your upload endpoint
              toast.info("Image upload would be handled by your backend");
            }} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>Cancel</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
