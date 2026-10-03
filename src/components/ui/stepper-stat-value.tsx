import * as React from "react";
import { clsx } from "~/utils";

const StepperStatValue = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={clsx("text-lg font-semibold text-foreground", className)} {...props}>
      {children}
    </p>
  ),
);
StepperStatValue.displayName = "StepperStatValue";

export { StepperStatValue };
