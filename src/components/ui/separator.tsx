import * as React from "react";
import { clsx } from "~/utils";

const Separator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={clsx("border-border", className)}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";

export { Separator };
