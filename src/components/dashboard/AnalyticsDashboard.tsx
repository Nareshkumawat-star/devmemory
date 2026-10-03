"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StepperStat } from "@/components/ui/stepper-stat";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "@/components/analytics/RechartsWrapper";
import {
  TrendingUp,
  FileCode,
  AlertTriangle,
  Target,
  Activity,
} from "lucide-react";
import {
  severityDistribution,
  problemsSolvedCount,
  mistakeTrend,
  improvementTimeline,
  difficultyDistribution,
} from "@/lib/ai/analytics";
import type { CodingMemory } from "@/types";

/**
 * Group memories into topics.
 *
 * `topicWeakness()` in lib/ai/analytics.ts buckets by `lessonLearned`, which
 * leaves a phantom "" (empty-string) bucket for memories saved without a
 * lesson — that is what the dashboard card rendered as a blank label.
 *
 * This replaces it with a grouping on `tags` (a real per-memory field), and
 * falls back to `lessonLearned` only when the memory has no tags at all.
 * That gives every entry a real topic name to display, with no hardcoded copy.
 */
function groupMemoriesByTopic(memories: CodingMemory[]): [string, number][] {
  const groups: Record<string, number> = {};

  for (const memory of memories) {
    const tags = memory.tags && memory.tags.length > 0 ? memory.tags : [memory.lessonLearned.trim()];
    const topic = tags[0];
    if (!topic) continue;
    groups[topic] = (groups[topic] ?? 0) + 1;
  }

  return Object.entries(groups).sort((a, b) => b[1] - a[1]);
}



interface AnalyticsDashboardProps {
  memories: CodingMemory[];
}

function formatTrend(values: number[]): { label: string; value: number }[] {
  return values.map((value, i) => ({ label: `Day ${i + 1}`, value }));
}

function formatTimeline(values: number[]): { label: string; value: number }[] {
  return values.map((value, i) => ({ label: `Week ${i + 1}`, value }));
}

export function AnalyticsDashboard({ memories }: AnalyticsDashboardProps) {
  const severity = severityDistribution(memories);
  const topics = groupMemoriesByTopic(memories);
  const solved = problemsSolvedCount(memories);
  const trend = mistakeTrend(memories, "7d");
  const timeline = improvementTimeline(memories, "30d");
  const beginner = difficultyDistribution(memories, "beginner");
  const intermediate = difficultyDistribution(memories, "intermediate");
  const advanced = difficultyDistribution(memories, "advanced");
  const total = memories.length;



  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StepperStat label="Total Memories" value={String(total)} prefix={<FileCode className="h-4 w-4" />} />
        <StepperStat label="Problems Solved" value={String(solved)} prefix={<Target className="h-4 w-4" />} />
        <StepperStat
          label="Mistake Trend (7d)"
          value={
            trend[trend.length - 1] >= 50
              ? "Improving"
              : trend[trend.length - 1] <= 50
                ? "Needs Work"
                : "Stable"
          }
        />
        <StepperStat
          label="Avg Difficulty"
          value={total ? ((beginner + intermediate + advanced) / total).toFixed(2) : "0"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span>Mistake severity</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{severity.high}</div>
              <div className="text-xs text-muted-foreground">High</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">{severity.medium}</div>
              <div className="text-xs text-muted-foreground">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{severity.low}</div>
              <div className="text-xs text-muted-foreground">Low</div>
            </div>
          </div>
        </div>

        <div className="rounded-md border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>Difficulty breakdown</span>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Beginner</span>
              <span className="font-medium">{beginner}</span>
            </div>
            <Progress value={beginner} max={total} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Intermediate</span>
              <span className="font-medium">{intermediate}</span>
            </div>
            <Progress value={intermediate} max={total} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Advanced</span>
              <span className="font-medium">{advanced}</span>
            </div>
            <Progress value={advanced} max={total} />
          </div>
        </div>

        <div className="rounded-md border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>Mistake frequency over 7 days</span>
          </div>
          <ChartContainer config={{
            value: { label: "Mistake Frequency", color: "var(--chart-1)" },
          }} height={160}>
            <BarChart data={formatTrend(trend)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="rounded-md border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Improvement timeline (30 days)</span>
          </div>
          <ChartContainer config={{
            value: { label: "Improvement Level", color: "var(--chart-5)" },
          }} height={160}>
            <LineChart data={formatTimeline(timeline)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--chart-5)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topic Weakness</CardTitle>
          <CardDescription>Most frequent mistakes by topic</CardDescription>
        </CardHeader>
        <CardContent>            {topics.length === 0 ? (
              <Alert>
                <AlertDescription>No topic data yet. Save some memories and add tags or lessons to see your topic weaknesses.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {topics.map(([topic, count]) => (
                  <div key={topic} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{topic}</div>
                      <Progress value={count} max={Math.max(1, ...topics.map(([, c]) => c))} className="h-2" />
                    </div>
                    <div className="text-sm font-semibold">{count}</div>
                  </div>
                ))}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
