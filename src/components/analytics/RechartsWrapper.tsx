"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { clsx } from "~/utils";

export interface ChartConfig {
  [key: string]: {
    label?: string;
    color?: string;
    format?: (value: number) => string;
  };
}

interface ChartContainerProps {
  config?: ChartConfig;
  className?: string;
  children: ReactNode;
  height?: number | string;
}

/**
 * Single ResponsiveContainer wrapper. Chart children must be exactly one
 * Recharts chart element (e.g. <BarChart />).
 */
export function ChartContainer({
  className,
  children,
  height = 300,
}: ChartContainerProps) {
  return (
    <div className={clsx("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

/** Shape recharts hands to a custom tooltip renderer. */
export interface ChartTooltipEntry {
  dataKey?: string | number;
  name?: string | number;
  value?: number | string;
  color?: string;
  payload?: unknown;
}

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: string | number;
  className?: string;
  config?: ChartConfig;
}

export function ChartTooltip({
  content,
  cursor = false,
}: {
  content?: ReactNode;
  cursor?: boolean;
}) {
  return <Tooltip cursor={cursor} content={content as never} />;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  config,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={clsx(
        "rounded-md border bg-background p-3 text-sm shadow-md",
        className,
      )}
    >
      {label ? (
        <div className="mb-1 font-medium text-foreground">{label}</div>
      ) : null}

      <div className="grid gap-1.5">
        {payload.map((entry, index) => {
          const key = String(entry.dataKey ?? index);
          const configItem = config?.[key];
          const value = Number(entry.value ?? 0);

          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color || "var(--chart-1)" }}
              />
              <span className="text-muted-foreground">
                {configItem?.label || entry.name || key}
              </span>
              <span className="ml-auto font-medium">
                {configItem?.format ? configItem.format(value) : value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Chart primitives re-exported so callers only import from this module. */
export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
};