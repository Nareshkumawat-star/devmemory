import * as React from "react";
import { clsx } from "~/utils";

const StepperHorizontal = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("flex flex-col gap-4", className)} {...props}>
      {children}
    </div>
  ),
);
StepperHorizontal.displayName = "StepperHorizontal";

export { StepperHorizontal };
