import { Brain, TrendingUp, TrendingDown, AlertTriangle, ThumbsUp, MessageSquare, Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/admin/SharedComponents";

const insights = [
  {
    icon: AlertTriangle,
    title: "Helmet Sizing Complaints",
    description: "Customers frequently complain about helmet sizing. Consider adding a detailed sizing guide.",
    type: "warning" as const,
    category: "Reviews",
  },
  {
    icon: TrendingDown,
    title: "Gloves Return Rate",
    description: "Gloves category has the highest return rate at 12%. Review quality and descriptions.",
    type: "negative" as const,
    category: "Returns",
  },
  {
    icon: TrendingUp,
    title: "Tank Bags Sales Surge",
    description: "Tank bags have increased sales by 40% in the last 30 days. Consider increasing stock.",
    type: "positive" as const,
    category: "Sales",
  },
  {
    icon: AlertTriangle,
    title: "Low-Rated Products",
    description: "Products with rating below 3.5 should be reviewed. 4 products currently below threshold.",
    type: "warning" as const,
    category: "Quality",
  },
  {
    icon: ThumbsUp,
    title: "Top Performer: Racing Helmet Pro",
    description: "Racing Helmet Pro maintains 4.8★ rating with 245 sales this month. Strong performer.",
    type: "positive" as const,
    category: "Products",
  },
  {
    icon: TrendingDown,
    title: "Declining: Handlebar Grips",
    description: "Handlebar Grips sales declined 25% month-over-month. Review pricing and competition.",
    type: "negative" as const,
    category: "Sales",
  },
];

const reviewSummary = {
  positive: ["High-quality materials", "Fast delivery", "Good value for money", "Comfortable fit"],
  negative: ["Sizing inconsistencies", "Packaging could be better", "Limited color options"],
  suggestions: [
    "Add detailed sizing charts for all apparel",
    "Improve packaging for fragile items",
    "Expand color range for popular products",
    "Add video reviews from verified buyers",
  ],
};

const typeStyles = {
  positive: "border-success/20 bg-success/5",
  negative: "border-destructive/20 bg-destructive/5",
  warning: "border-warning/20 bg-warning/5",
};

const iconStyles = {
  positive: "text-success bg-success/10",
  negative: "text-destructive bg-destructive/10",
  warning: "text-warning bg-warning/10",
};

export default function AIInsights() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="AI Insights" description="AI-powered analysis of your platform data">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
          <Brain className="w-4 h-4" />
          Powered by AI
        </div>
      </PageHeader>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <div key={i} className={`rounded-xl border p-5 space-y-3 ${typeStyles[insight.type]}`}>
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconStyles[insight.type]}`}>
                <insight.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                {insight.category}
              </span>
            </div>
            <h3 className="font-semibold text-sm">{insight.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
          </div>
        ))}
      </div>

      {/* Review Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="w-4 h-4 text-success" />
            <h3 className="font-semibold">Common Positives</h3>
          </div>
          <ul className="space-y-2">
            {reviewSummary.positive.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-destructive" />
            <h3 className="font-semibold">Common Complaints</h3>
          </div>
          <ul className="space-y-2">
            {reviewSummary.negative.map((n, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                {n}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-warning" />
            <h3 className="font-semibold">Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {reviewSummary.suggestions.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
