import * as React from "react";
import { clsx } from "~/utils";
import { StepperBadge } from "~/components/ui/stepper-badge";
import { StepperDot } from "~/components/ui/stepper-dot";
import { StepperLine } from "~/components/ui/stepper-line";

const StepperStep = React.forwardRef<HTMLDivElement, {
  title: string;
  description?: string;
  completed?: boolean;
  active?: boolean;
  status?: "default" | "completed" | "error" | "warning";
  badge?: string;
  children: React.ReactNode;
  index?: number;
}>(({ title, description, completed = false, active = false, status = "default", badge }, ref) => (
  <div ref={ref} className={clsx("flex gap-4 px-1 py-2 rounded-md transition-colors", active ? "bg-accent" : "hover:bg-muted/30")}>
    <div className="flex flex-col items-center gap-1">
      {status === "completed" ? (
        <StepperBadge variant="completed">{badge}</StepperBadge>
      ) : active ? (
        <StepperDot size={8} />
      ) : (
        <StepperDot size={8} completed={completed} />
      )}
      {description && <span className="text-xs text-muted-foreground">{description}</span>}
    </div>
    <div className="flex-1 min-w-0">
      <div className={clsx("font-medium text-sm", active ? "text-foreground" : "text-muted-foreground")}>{title}</div>
      {description && <div className="text-xs text-muted-foreground">{description}</div>}
    </div>
    <div className="w-16">
      {status === "completed" ? <StepperLine completed /> : active ? <StepperLine active /> : <StepperLine />}
    </div>
  </div>
));
StepperStep.displayName = "StepperStep";

export { StepperStep };
