/**
 * @fileoverview Contextual execution boundary for frontend/src/components/ui/Skeleton.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-slate-200/60", className)}
            {...props}
        />
    )
}

export { Skeleton }

