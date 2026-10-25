import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "orange";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none";

    const variants = {
      primary: "bg-navy-900 text-white hover:bg-navy-800 focus:ring-navy-900 shadow-sm border border-navy-800",
      orange: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 shadow-sm hover:shadow hover:-translate-y-0.5",
      secondary: "bg-steel-100 text-steel-900 hover:bg-steel-200 focus:ring-steel-400 dark:bg-steel-800 dark:text-steel-100 dark:hover:bg-steel-700",
      outline: "border-2 border-navy-900 text-navy-900 hover:bg-navy-50 focus:ring-navy-900 dark:border-steel-300 dark:text-steel-200 dark:hover:bg-navy-950",
      ghost: "text-steel-700 hover:bg-steel-100 focus:ring-steel-400 dark:text-steel-300 dark:hover:bg-steel-800",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-3 gap-2.5 font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
