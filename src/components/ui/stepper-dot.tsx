import * as React from "react";
import { clsx } from "~/utils";

const StepperDot = React.forwardRef<HTMLSpanElement, { size?: number; completed?: boolean; active?: boolean }>(
  ({ size = 8, completed = false, active = false }, ref) => {
    const base = "rounded-full transition-all duration-300";
    const sizes: Record<number, string> = {
      4: "h-4 w-4",
      6: "h-6 w-6",
      8: "h-8 w-8",
      10: "h-10 w-10",
    };
    const states = { completed: "bg-green-500", active: "bg-primary ring-2 ring-primary/20", default: "bg-muted" };
    return (
      <span ref={ref} className={clsx(base, sizes[size], states[completed ? "completed" : active ? "active" : "default"])} />
    );
  },
);
StepperDot.displayName = "StepperDot";

export { StepperDot };
