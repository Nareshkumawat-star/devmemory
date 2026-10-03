import * as React from "react";
import { TooltipTrigger } from "~/components/ui/tooltip-trigger";
import { TooltipContent } from "~/components/ui/tooltip-content";

const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  return (
    <TooltipTrigger>
      {children}
      <TooltipContent>{content}</TooltipContent>
    </TooltipTrigger>
  );
};

export { Tooltip, TooltipTrigger, TooltipContent };
