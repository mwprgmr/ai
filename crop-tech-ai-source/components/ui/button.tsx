"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
};

export function Button({ className, variant = "secondary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "border-[var(--accent)] bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]",
        variant === "secondary" && "border-[var(--border)] bg-[var(--panel)] text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10",
        variant === "ghost" && "border-transparent bg-transparent hover:bg-black/5 dark:hover:bg-white/10",
        variant === "danger" && "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
        size === "sm" && "h-8 px-2.5",
        size === "md" && "h-10 px-3.5",
        size === "icon" && "h-9 w-9 p-0",
        className
      )}
      {...props}
    />
  );
}
