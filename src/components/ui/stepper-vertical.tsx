import * as React from "react";
import { clsx } from "~/utils";

const StepperVertical = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("flex flex-col gap-4", className)} {...props}>
      {children}
    </div>
  ),
);
StepperVertical.displayName = "StepperVertical";

export { StepperVertical };
