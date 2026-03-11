import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, description }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      {(change || description) && (
        <div className="mt-1 flex items-center gap-2">
          {change && (
            <span className={cn(
              "text-xs font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {change}
            </span>
          )}
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
      )}
    </div>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    delivered: "bg-success/10 text-success border-success/20",
    shipped: "bg-primary/10 text-primary border-primary/20",
    processing: "bg-warning/10 text-warning border-warning/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    pending: "bg-muted text-muted-foreground border-border",
    paid: "bg-success/10 text-success border-success/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20",
    active: "bg-success/10 text-success border-success/20",
    inactive: "bg-muted text-muted-foreground border-border",
    "in stock": "bg-success/10 text-success border-success/20",
    "low stock": "bg-warning/10 text-warning border-warning/20",
    "out of stock": "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status.toLowerCase()] || styles.pending)}>
      {status}
    </span>
  );
}
