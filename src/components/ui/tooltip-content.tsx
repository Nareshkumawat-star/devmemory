import * as React from "react";
import { clsx } from "~/utils";

const TooltipContent = React.forwardRef<HTMLDivElement, { className?: string; children: React.ReactNode }>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-80", className)} {...props}>
      {children}
    </div>
  ),
);
TooltipContent.displayName = "TooltipContent";

export { TooltipContent };
