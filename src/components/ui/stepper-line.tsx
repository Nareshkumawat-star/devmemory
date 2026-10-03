import * as React from "react";
import { clsx } from "~/utils";

const StepperLine = React.forwardRef<HTMLDivElement, { completed?: boolean; active?: boolean; orientation?: "horizontal" | "vertical" }>(
  ({ completed = false, active = false, orientation = "horizontal" }, ref) => {
    const base = "w-full h-1 rounded-full transition-all duration-300";
    const orientations = { horizontal: "w-full", vertical: "h-full" };
    const states = { completed: "bg-green-500", active: "bg-primary", default: "bg-muted" };
    return (
      <div ref={ref} className={clsx(base, orientations[orientation], states[completed ? "completed" : active ? "active" : "default"])} />
    );
  },
);
StepperLine.displayName = "StepperLine";

export { StepperLine };
