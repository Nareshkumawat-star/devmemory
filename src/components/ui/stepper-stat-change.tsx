import * as React from "react";
import { clsx } from "~/utils";

const StepperStatChange = React.forwardRef<HTMLParagraphElement, { value: string | number; type: "increase" | "decrease" | "neutral" }>(
  ({ value, type }, ref) => {
    const variants = { increase: "text-green-600", decrease: "text-red-600", neutral: "text-muted-foreground" };
    const prefixes = { increase: "▲", decrease: "▼", neutral: "—" };
    return (
      <p ref={ref} className={clsx("flex items-center gap-1 text-xs font-medium", variants[type])}>
        <span>{prefixes[type]}</span>
        {value}
      </p>
    );
  },
);
StepperStatChange.displayName = "StepperStatChange";

export { StepperStatChange };
