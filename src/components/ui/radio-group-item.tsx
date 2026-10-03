import * as React from "react";
import { clsx } from "~/utils";

const RadioGroupItem = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="radio"
      className={clsx(
        "h-4 w-4 border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className,
      )}
      {...props}
    />
  ),
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroupItem };
