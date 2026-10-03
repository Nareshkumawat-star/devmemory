import * as React from "react";
import { clsx } from "~/utils";

const StepperPanels = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("flex-1 p-4", className)} {...props}>
      {children}
    </div>
  ),
);
StepperPanels.displayName = "StepperPanels";

export { StepperPanels };
