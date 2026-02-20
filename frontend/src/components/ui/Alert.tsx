import React from "react";
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
    title: string;
    description?: string;
    variant?: "info" | "warning" | "error" | "success";
    className?: string;
}

export function Alert({ title, description, variant = "info", className }: AlertProps) {
    const Icon = {
        info: Info,
        warning: AlertTriangle,
        error: XCircle,
        success: CheckCircle2,
    }[variant];

    const variants = {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        warning: "bg-amber-50 border-amber-200 text-amber-800",
        error: "bg-red-50 border-red-200 text-red-800",
        success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    };

    const iconColors = {
        info: "text-blue-600",
        warning: "text-amber-600",
        error: "text-red-600",
        success: "text-emerald-600",
    };

    return (
        <div className={cn("p-4 rounded-lg border flex items-start gap-3 shadow-sm", variants[variant], className)}>
            <Icon className={cn("w-6 h-6 flex-shrink-0 mt-0.5", iconColors[variant])} strokeWidth={2} />
            <div className="w-full">
                <h4 className="font-semibold text-sm">{title}</h4>
                {description && <p className={cn("text-sm mt-1 opacity-90")}>{description}</p>}
            </div>
        </div>
    );
}

