import * as React from "react";
import { clsx } from "~/utils";

const StepperBadge = React.forwardRef<HTMLSpanElement, { children: React.ReactNode; variant?: "default" | "completed" | "pending" | "error" | "warning" }>(
  ({ children, variant = "default" }, ref) => {
    const variants = {
      default: "bg-primary/10 text-primary border-primary/20",
      completed: "bg-green-500/10 text-green-600 border-green-500/20",
      pending: "bg-muted text-muted-foreground border-transparent",
      error: "bg-red-500/10 text-red-600 border-red-500/20",
      warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    };
    return (
      <span ref={ref} className={clsx("inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium", variants[variant])}>
        {children}
      </span>
    );
  },
);
StepperBadge.displayName = "StepperBadge";

export { StepperBadge };
