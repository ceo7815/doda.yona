import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-900 text-gold-400 shadow-sm hover:bg-brand-800 hover:shadow-md active:bg-brand-900",
  secondary:
    "bg-gold-500 text-brand-900 shadow-sm hover:bg-gold-400 hover:shadow-md active:bg-gold-600",
  ghost: "bg-transparent text-ink shadow-none hover:bg-brand-100 hover:shadow-none",
  danger: "bg-danger text-white shadow-sm hover:opacity-90 hover:shadow-md",
  outline:
    "border border-border-strong bg-surface-elevated text-ink shadow-none hover:bg-brand-50 hover:shadow-sm",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3 text-sm",
  md: "min-h-11 px-4 text-base",
  lg: "min-h-12 px-6 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-bold",
          "transition-[background-color,transform,box-shadow,opacity] duration-200",
          "hover:-translate-y-px active:translate-y-0",
          "disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0",
          "focus-visible:outline-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading ? <span className="sr-only">טוען…</span> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
