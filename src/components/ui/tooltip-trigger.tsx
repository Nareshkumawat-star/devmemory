import * as React from "react";
import { clsx } from "~/utils";

const TooltipTrigger = React.forwardRef<HTMLDivElement, { className?: string; children: React.ReactNode }>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("cursor-default", className)} {...props}>
      {children}
    </div>
  ),
);
TooltipTrigger.displayName = "TooltipTrigger";

export { TooltipTrigger };
