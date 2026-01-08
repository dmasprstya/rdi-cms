import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        label: string;
    };
    variant?: "default" | "primary" | "success" | "warning" | "info";
    className?: string;
}

const variantStyles = {
    default: "from-muted/50 to-muted/30 border-border",
    primary: "from-primary/10 to-primary/5 border-primary/20",
    success: "from-success/10 to-success/5 border-success/20",
    warning: "from-warning/10 to-warning/5 border-warning/20",
    info: "from-info/10 to-info/5 border-info/20",
};

const iconVariantStyles = {
    default: "bg-muted text-foreground",
    primary: "bg-primary/20 text-primary",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    info: "bg-info/20 text-info",
};

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    variant = "default",
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 transition-all hover:shadow-lg",
                variantStyles[variant],
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold text-foreground">{value}</p>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 text-xs">
                            <span
                                className={cn(
                                    "font-medium",
                                    trend.value > 0 ? "text-success" : "text-destructive"
                                )}
                            >
                                {trend.value > 0 ? "+" : ""}
                                {trend.value}%
                            </span>
                            <span className="text-muted-foreground">{trend.label}</span>
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        "rounded-lg p-3 transition-transform group-hover:scale-110",
                        iconVariantStyles[variant]
                    )}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}
