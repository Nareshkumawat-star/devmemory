import * as React from "react";

const StepperLog = React.forwardRef<HTMLUListElement, { entries: Array<{ id: string; action: string; timestamp: string }>; maxEntries?: number }>(
  ({ entries, maxEntries = 20 }, ref) => {
    const limitedEntries = entries.slice(-maxEntries).reverse();
    return (
      <ul ref={ref} className="space-y-1">
        {limitedEntries.map((entry) => (
          <li key={entry.id} className="text-xs text-muted-foreground flex gap-2 py-1">
            <span className="font-mono">{entry.timestamp}</span>
            <span>{entry.action}</span>
          </li>
        ))}
      </ul>
    );
  },
);
StepperLog.displayName = "StepperLog";

export { StepperLog };
