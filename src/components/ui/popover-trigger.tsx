import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { clsx } from "~/utils";
import { Slot } from "@radix-ui/react-slot";

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ asChild = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : PopoverPrimitive.Trigger;
  return <Comp ref={ref} className={clsx(className)} {...props} />;
});
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

export { PopoverTrigger };
