import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "danger" | "warning" | "info" | "default";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const styles = {
    success: "bg-status-present/10 text-status-present",
    danger: "bg-status-absent/10 text-status-absent",
    warning: "bg-secondary/10 text-secondary-dark",
    info: "bg-status-lms/10 text-status-lms",
    default: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider", styles[variant])}>
      {children}
    </span>
  );
}