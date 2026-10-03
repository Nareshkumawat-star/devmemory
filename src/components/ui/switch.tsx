import * as React from "react";
import { clsx } from "~/utils";

const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={clsx(
        "peer h-6 w-11 cursor-pointer appearance-none rounded-full border border-input bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-primary",
        "after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-background after:bg-background",
        className,
      )}
      {...props}
    />
  ),
);
Switch.displayName = "Switch";

export { Switch };
