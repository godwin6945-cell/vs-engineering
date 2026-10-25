import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-steel-700 dark:text-steel-300">
            {label}
            {props.required && <span className="text-orange-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full px-3.5 py-2 text-sm rounded-md border bg-white dark:bg-navy-900 text-steel-900 dark:text-steel-100 placeholder:text-steel-400 focus:outline-none focus:ring-2 transition-all",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-steel-300 dark:border-steel-700 focus:border-navy-900 dark:focus:border-orange-500 focus:ring-navy-900/10 dark:focus:ring-orange-500/10",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-steel-500 dark:text-steel-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-steel-700 dark:text-steel-300">
            {label}
            {props.required && <span className="text-orange-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={props.rows || 3}
          className={cn(
            "w-full px-3.5 py-2 text-sm rounded-md border bg-white dark:bg-navy-900 text-steel-900 dark:text-steel-100 placeholder:text-steel-400 focus:outline-none focus:ring-2 transition-all",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-steel-300 dark:border-steel-700 focus:border-navy-900 dark:focus:border-orange-500 focus:ring-navy-900/10 dark:focus:ring-orange-500/10",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-steel-500 dark:text-steel-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
