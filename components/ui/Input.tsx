"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] tracking-wide uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-150 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
