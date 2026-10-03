"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";

const StepperActions = React.forwardRef<
  HTMLDivElement,
  {
    primaryLabel?: string;
    secondaryLabel?: string;
    onPrimary?: () => void;
    onSecondary?: () => void;
    primaryDisabled?: boolean;
    secondaryDisabled?: boolean;
    variant?: "default" | "danger";
  }
>(({ primaryLabel = "Continue", secondaryLabel, onPrimary, onSecondary, primaryDisabled = false, secondaryDisabled = false, variant = "default" }, ref) => {
  return (
    <div ref={ref} className="flex justify-end gap-2">
      {secondaryLabel && (
        <Button variant="outline" onClick={onSecondary} disabled={secondaryDisabled}>
          {secondaryLabel}
        </Button>
      )}
      <Button variant={variant === "danger" ? "destructive" : "default"} onClick={onPrimary} disabled={primaryDisabled}>
        {primaryLabel}
      </Button>
    </div>
  );
});
StepperActions.displayName = "StepperActions";

export { StepperActions };
