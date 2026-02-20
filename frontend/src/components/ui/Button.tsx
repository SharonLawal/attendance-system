import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "babcock";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {

    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-transparent",
      outline: "bg-transparent border-2 border-slate-200 text-slate-700 hover:bg-slate-50",
      ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent",
      danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
      babcock: "bg-babcock-blue text-white hover:bg-opacity-90 shadow-lg shadow-babcock-blue/30 border border-transparent",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm rounded-lg",
      md: "h-11 px-5 text-base rounded-lg",
      lg: "h-14 px-8 text-lg rounded-lg",
      icon: "h-10 w-10 p-2 rounded-lg flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

