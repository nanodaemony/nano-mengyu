"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 shadow-[0_1px_3px_rgba(139,92,246,0.3)] hover:shadow-[0_2px_6px_rgba(139,92,246,0.4)] active:shadow-none",
  secondary:
    "bg-[var(--color-surface-alt)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)]",
  ghost:
    "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]",
  danger:
    "bg-status-danger/15 text-status-danger hover:bg-status-danger/25",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-5 py-2.5 text-base rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/40 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] ${
        variants[variant]
      } ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
