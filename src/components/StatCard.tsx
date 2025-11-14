import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent" | "success";
}

export const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">{value}</p>
            {trend && (
              <p className={cn(
                "mt-2 text-sm font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? "↗" : "↘"} {trend.value}
              </p>
            )}
          </div>
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl",
            variant === "primary" && "bg-primary/10",
            variant === "accent" && "bg-accent/10",
            variant === "success" && "bg-success/10",
            variant === "default" && "bg-muted"
          )}>
            <Icon className={cn(
              "h-7 w-7",
              variant === "primary" && "text-primary",
              variant === "accent" && "text-accent",
              variant === "success" && "text-success",
              variant === "default" && "text-muted-foreground"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
