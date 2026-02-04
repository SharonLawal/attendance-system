import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-dark",
      secondary: "bg-secondary text-white hover:bg-secondary-dark",
      danger: "bg-danger text-white hover:opacity-90",
      outline: "border-2 border-primary text-primary hover:bg-primary/10",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading}
        className={cn(
          "px-4 py-2 rounded-md font-medium transition-all flex items-center justify-center disabled:opacity-50",
          variants[variant],
          className,
        )}
        {...props}
      >
        {isLoading ? <span className="animate-spin mr-2">...</span> : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
