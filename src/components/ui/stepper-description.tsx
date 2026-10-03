import * as React from "react";
import { clsx } from "~/utils";

const StepperDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={clsx("text-sm text-muted-foreground", className)} {...props} />
  ),
);
StepperDescription.displayName = "StepperDescription";

export { StepperDescription };
