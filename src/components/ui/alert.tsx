import * as React from "react";
import { clsx } from "~/utils";
import { alertVariants, type AlertVariants } from "~/components/ui/alert-variants";

const Alert = React.forwardRef<HTMLDivElement, AlertVariants & React.HTMLAttributes<HTMLDivElement>>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(alertVariants({ variant }), "space-y-2", className)}
      {...props}
    />
  ),
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={clsx("text-sm font-semibold", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("text-sm", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
