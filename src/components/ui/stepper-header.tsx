import * as React from "react";
import { clsx } from "~/utils";

const StepperHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("mb-4 space-y-1", className)} {...props}>
      {children}
    </div>
  ),
);
StepperHeader.displayName = "StepperHeader";

const StepperHeaderLabel = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={clsx("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
StepperHeaderLabel.displayName = "StepperHeaderLabel";

const StepperHeaderDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={clsx("text-sm text-muted-foreground", className)} {...props} />
  ),
);
StepperHeaderDescription.displayName = "StepperHeaderDescription";

export { StepperHeader, StepperHeaderLabel, StepperHeaderDescription };
