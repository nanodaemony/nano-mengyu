// components/ui/Badge.tsx
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger";
}

const variants = {
  default: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  success: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  danger: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
};

export default function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
