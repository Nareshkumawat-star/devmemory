import * as React from "react";
import { clsx } from "~/utils";

const StepperStatLabel = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={clsx("text-xs text-muted-foreground", className)} {...props} />
  ),
);
StepperStatLabel.displayName = "StepperStatLabel";

export { StepperStatLabel };
