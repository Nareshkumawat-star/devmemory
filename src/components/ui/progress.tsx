import * as React from "react";
import { clsx } from "~/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  animated?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, animated = true, ...props }, ref) => {
    const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

    return (
      <div className={clsx("w-full overflow-hidden rounded-full bg-secondary", className)} ref={ref} {...props}>
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{
            width: animated ? `${percentage}%` : "0%",
            transition: animated ? "width 0.3s ease" : "none",
          }}
        />
      </div>
    );
  },
);
Progress.displayName = "Progress";

export { Progress };
