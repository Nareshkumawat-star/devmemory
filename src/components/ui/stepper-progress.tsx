import * as React from "react";
import { clsx } from "~/utils";

const StepperProgress = React.forwardRef<HTMLDivElement, { value: number; total: number; variant?: "default" | "success" | "warning" | "error"; showLabel?: boolean }>(
  ({ value, total, variant = "default", showLabel = true }, ref) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    const variants = { default: "bg-primary", success: "bg-green-500", warning: "bg-yellow-500", error: "bg-red-500" };
    return (
      <div ref={ref} className="flex flex-col gap-2">
        {showLabel && <div className="text-xs text-muted-foreground">Progress</div>}
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className={clsx("h-full rounded-full transition-all duration-500", variants[variant])} style={{ width: `${percentage}%` }} />
        </div>
        <div className="text-xs text-muted-foreground">{value}/{total}</div>
      </div>
    );
  },
);
StepperProgress.displayName = "StepperProgress";

export { StepperProgress };
