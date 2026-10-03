import * as React from "react";
import { clsx } from "~/utils";

const DropdownMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={clsx("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
));
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export { DropdownMenuShortcut };
