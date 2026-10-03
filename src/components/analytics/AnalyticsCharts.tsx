"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { mistakeFrequency, severityDistribution, topicWeakness, improvementTimeline } from "@/lib/ai/analytics";
import type { CodingMemory } from "@/types";

interface AnalyticsChartsProps {
  memories: CodingMemory[];
}

export function AnalyticsCharts({ memories }: AnalyticsChartsProps) {
  const frequency = mistakeFrequency(memories);
  const severity = severityDistribution(memories);
  const topicWeaknessMap = topicWeakness(memories);

  // Latest value of each window: 0-100 scale, higher is better.
  const improvementWindows = [
    { label: "Last week", values: improvementTimeline(memories, "7d") },
    { label: "Last 30 days", values: improvementTimeline(memories, "30d") },
    { label: "Last 90 days", values: improvementTimeline(memories, "90d") },
  ].map(({ label, values }) => ({
    label,
    value: values.length > 0 ? values[values.length - 1] : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mistakes</CardTitle>
            <div className="h-2 w-2 rounded-full bg-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memories.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{frequency.error || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{severity.high || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Solved</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memories.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Mistake Frequency</CardTitle>
            <CardDescription>Mistakes by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm font-medium">Errors</span>
                <span className="text-sm text-muted-foreground">{frequency.error || 0}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium">Lessons</span>
                <span className="text-sm text-muted-foreground">{frequency.lesson || 0}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Approaches</span>
                <span className="text-sm text-muted-foreground">{frequency.approach || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mistake Severity</CardTitle>
            <CardDescription>Your mistakes by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm font-medium">High</span>
                <span className="text-sm text-muted-foreground">{severity.high || 0}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium">Medium</span>
                <span className="text-sm text-muted-foreground">{severity.medium || 0}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Low</span>
                <span className="text-sm text-muted-foreground">{severity.low || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Topic Weakness</CardTitle>
            <CardDescription>Most frequent mistakes by topic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(topicWeaknessMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([topic, count]) => (
                  <div key={topic} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm font-medium flex-1 truncate">{topic}</span>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Improvement Timeline</CardTitle>
            <CardDescription>Your progress over the last 7, 30, and 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {improvementWindows.map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-sm text-muted-foreground">{value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
