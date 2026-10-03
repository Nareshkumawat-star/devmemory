import * as React from "react";
import { StepperStatLabel } from "~/components/ui/stepper-stat-label";
import { StepperStatValue } from "~/components/ui/stepper-stat-value";
import { StepperStatChange } from "~/components/ui/stepper-stat-change";
import { StepperStatChangeType } from "~/components/ui/stepper-stat-change-type";

const StepperStat = React.forwardRef<HTMLDivElement, { label: string; value: string | number; change?: { value: string | number; type: StepperStatChangeType }; prefix?: React.ReactNode; suffix?: React.ReactNode }>(
  ({ label, value, change, prefix, suffix }, ref) => (
    <div ref={ref} className="rounded-md border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <StepperStatLabel>{label}</StepperStatLabel>
        {change && <StepperStatChange type={change.type} value={change.value} />}
      </div>
      <StepperStatValue>
        {prefix ? <span className="mr-1 inline-flex align-middle">{prefix}</span> : null}
        {value}
        {suffix ? <span className="ml-1 inline-flex align-middle">{suffix}</span> : null}
      </StepperStatValue>
    </div>
  ),
);
StepperStat.displayName = "StepperStat";

export { StepperStat };
