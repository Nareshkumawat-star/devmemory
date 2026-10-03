import * as React from "react";
import { clsx } from "~/utils";
import { Button, ButtonProps } from "~/components/ui/button";

const StepperButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <Button ref={ref} variant={variant} size={size} className={clsx("rounded-md px-4 py-2 text-sm font-medium transition-colors", className)} {...props} />
  ),
);
StepperButton.displayName = "StepperButton";

export { StepperButton };
