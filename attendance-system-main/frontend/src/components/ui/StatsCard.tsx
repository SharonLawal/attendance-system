import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "danger" | "warning";
}

export function StatsCard({ title, value, description, icon: Icon, variant = "default" }: StatsCardProps) {
  const variants = {
    default: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    danger: "text-danger bg-danger/10",
    warning: "text-secondary bg-secondary/10",
  };

  return (
    <div className="bg-surface p-6 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4">
      <div className={cn("p-3 rounded-lg", variants[variant])}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {description && (
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}