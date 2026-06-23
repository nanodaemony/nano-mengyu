import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const variants = {
  default:
    "bg-black/[0.12] dark:bg-white/[0.15] text-[var(--color-text-secondary)]",
  success:
    "bg-emerald-300 text-emerald-900 dark:bg-emerald-900/80 dark:text-emerald-200",
  warning:
    "bg-amber-300 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200",
  danger:
    "bg-rose-300 text-rose-900 dark:bg-rose-900/80 dark:text-rose-200",
  info: "bg-sky-300 text-sky-900 dark:bg-sky-900/80 dark:text-sky-200",
};

export default function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium tracking-wide ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
