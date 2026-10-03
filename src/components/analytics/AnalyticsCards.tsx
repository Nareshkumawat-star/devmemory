"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { severityDistribution, mistakeTrend, problemsSolvedCount } from "@/lib/ai/analytics";
import type { CodingMemory } from "@/types";
import { TrendingUp, FileCode, AlertTriangle, Target } from "lucide-react";

interface AnalyticsCardsProps {
  memories: CodingMemory[];
}

function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-primary",
  description,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <div className={`flex h-8 w-8 rounded-full ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

export function AnalyticsCards({ memories }: AnalyticsCardsProps) {
  const severity = severityDistribution(memories);
  const trend = mistakeTrend(memories, "7d");
  const total = memories.length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Memories"
        value={String(total)}
        icon={FileCode}
        color="bg-primary/10"
        description="All your coding experiences"
      />
      <StatCard
        label="Mistake Trend (7d)"
        value={trend[trend.length - 1] >= 50 ? "Improving" : trend[trend.length - 1] <= 50 ? "Needs Work" : "Stable"}
        icon={TrendingUp}
        color={trend[trend.length - 1] >= 50 ? "bg-green-500/10" : trend[trend.length - 1] <= 50 ? "bg-red-500/10" : "bg-yellow-500/10"}
        description={`Last day score: ${trend[trend.length - 1]}`}
      />
      <StatCard
        label="High Severity"
        value={severity.high || 0}
        icon={AlertTriangle}
        color="bg-red-500/10"
        description="Critical errors needing attention"
      />
      <StatCard
        label="Problems Solved"
        value={problemsSolvedCount(memories)}
        icon={Target}
        color="bg-green-500/10"
        description="Your total problem count"
      />
    </div>
  );
}
