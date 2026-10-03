import * as React from "react";
import { clsx } from "~/utils";
import { StepperDot } from "~/components/ui/stepper-dot";
import { StepperLine } from "~/components/ui/stepper-line";

interface StepperIndicatorsProps {
  steps: number;
  currentStep: number;
  completed?: boolean;
  variant?: "horizontal" | "vertical";
}

const StepperIndicators = React.forwardRef<HTMLDivElement, StepperIndicatorsProps>(
  ({ steps, currentStep, variant = "horizontal" }, ref) => {
    const isHorizontal = variant === "horizontal";
    return (
      <div ref={ref} className={clsx("flex", isHorizontal ? "flex-row items-center gap-1" : "flex-col items-start gap-2")}>
        {Array.from({ length: steps }, (_, i) => (
          <React.Fragment key={i}>
            <StepperDot size={8} completed={i < currentStep} active={i === currentStep} />
            {i < steps - 1 && (
              <StepperLine completed={i < currentStep} active={i === currentStep} orientation={isHorizontal ? "horizontal" : "vertical"} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  },
);
StepperIndicators.displayName = "StepperIndicators";

export { StepperIndicators };
