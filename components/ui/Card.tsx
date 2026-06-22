import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  /** Module accent: adds a thin colored top border */
  accent?: "stocks" | "todos" | "ideas";
  /** Shadow depth (default: sm) */
  elevation?: "none" | "sm" | "md";
}

const accentBorders = {
  stocks: "border-t-[3px] border-t-module-stocks",
  todos: "border-t-[3px] border-t-module-todos",
  ideas: "border-t-[3px] border-t-module-ideas",
};

const elevations = {
  none: "",
  sm: "shadow-[0_1px_3px_rgba(30,27,46,0.06),0_1px_2px_rgba(30,27,46,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
  md: "shadow-[0_4px_6px_rgba(30,27,46,0.05),0_2px_8px_rgba(30,27,46,0.08)] dark:shadow-[0_4px_6px_rgba(0,0,0,0.3)]",
};

export default function Card({
  hover = false,
  accent,
  elevation = "sm",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 ${
        elevations[elevation]
      } ${
        accent ? accentBorders[accent] : ""
      } ${
        hover
          ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(30,27,46,0.08)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
