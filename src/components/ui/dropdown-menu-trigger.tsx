import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { clsx } from "~/utils";
import { Slot } from "@radix-ui/react-slot";

const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ asChild = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : DropdownMenuPrimitive.Trigger;
  return <Comp ref={ref} className={clsx(className)} {...props} />;
});
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

export { DropdownMenuTrigger };
