import * as React from "react";
import { clsx } from "~/utils";

const TabsTrigger = React.forwardRef<HTMLButtonElement, { className?: string; children: React.ReactNode }>(
  ({ className, children, ...props }, ref) => (
    <button ref={ref} className={clsx("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", className)} {...props}>
      {children}
    </button>
  ),
);
TabsTrigger.displayName = "TabsTrigger";

export { TabsTrigger };
