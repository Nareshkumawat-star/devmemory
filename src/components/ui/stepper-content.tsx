import * as React from "react";
import { clsx } from "~/utils";

const StepperContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("flex-1", className)} {...props}>
      {children}
    </div>
  ),
);
StepperContent.displayName = "StepperContent";

export { StepperContent };
