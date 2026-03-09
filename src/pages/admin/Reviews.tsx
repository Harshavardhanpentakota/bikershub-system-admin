import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Search, Trash2, Flag } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, EmptyState } from "@/components/admin/SharedComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function Reviews() {
  const [productId, setProductId] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const queryClient = useQueryClient();

  // Get products list for selector
  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.getProducts(),
  });
  const products = Array.isArray(productsData) ? productsData : productsData?.products || [];

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => api.getProductReviews(productId),
    enabled: !!productId,
  });

  const reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData?.reviews || [];
  const filtered = reviews.filter((r: any) =>
    ratingFilter === "all" || r.rating === Number(ratingFilter)
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteReview(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["reviews"] }); toast.success("Review deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Reviews" description="Manage product reviews" />

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={productId} onValueChange={setProductId}>
          <SelectTrigger className="w-64"><SelectValue placeholder="Select a product" /></SelectTrigger>
          <SelectContent>
            {products.map((p: any) => (
              <SelectItem key={p._id || p.id} value={p._id || p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Rating" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {[5, 4, 3, 2, 1].map((r) => <SelectItem key={r} value={String(r)}>{r} Stars</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {!productId ? (
        <EmptyState icon={Star} title="Select a product" description="Choose a product to view its reviews." />
      ) : (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">Loading reviews...</div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Star} title="No reviews found" description="This product has no reviews yet." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((review: any) => (
                  <TableRow key={review._id || review.id} className="border-border/50">
                    <TableCell className="font-medium">{review.name || review.user?.name || "Anonymous"}</TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{review.comment}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Review flagged")}>
                          <Flag className="w-4 h-4 text-warning" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(review._id || review.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}
