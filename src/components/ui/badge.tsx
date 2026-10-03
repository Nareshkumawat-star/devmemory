import * as React from "react";
import { clsx } from "~/utils";
import { badgeVariants, type BadgeVariants } from "~/components/ui/badge-variants";

const Badge = React.forwardRef<HTMLDivElement, BadgeVariants & React.HTMLAttributes<HTMLDivElement>>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(badgeVariants({ variant }), "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", className)}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

export { Badge };
