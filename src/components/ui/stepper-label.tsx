import * as React from "react";
import { clsx } from "~/utils";

const StepperLabel = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={clsx("text-sm font-medium", className)} {...props} />
  ),
);
StepperLabel.displayName = "StepperLabel";

export { StepperLabel };
