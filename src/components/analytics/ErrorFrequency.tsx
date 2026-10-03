"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mistakeFrequency, severityDistribution, topicWeakness, mistakeTrend } from "@/lib/ai/analytics";
import type { CodingMemory } from "@/types";
import { TrendingUp, Clock } from "lucide-react";

interface ErrorFrequencyProps {
  memories: CodingMemory[];
}

export function ErrorFrequency({ memories }: ErrorFrequencyProps) {
  const frequency = mistakeFrequency(memories);
  const severity = severityDistribution(memories);
  const topicWeaknessMap = topicWeakness(memories);
  const trend = mistakeTrend(memories, "7d");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mistake Frequency</CardTitle>
          <div className="h-2 w-2 rounded-full bg-primary" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-md bg-red-500/10">
              <div className="text-xl font-bold text-red-500">{frequency.error || 0}</div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
            <div className="p-3 rounded-md bg-yellow-500/10">
              <div className="text-xl font-bold text-yellow-500">{frequency.lesson || 0}</div>
              <div className="text-xs text-muted-foreground">Lessons</div>
            </div>
            <div className="p-3 rounded-md bg-blue-500/10">
              <div className="text-xl font-bold text-blue-500">{frequency.approach || 0}</div>
              <div className="text-xs text-muted-foreground">Approaches</div>
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
              <span className="text-sm text-muted-foreground ml-auto">{severity.high || 0}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium">Medium</span>
              <span className="text-sm text-muted-foreground ml-auto">{severity.medium || 0}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium">Low</span>
              <span className="text-sm text-muted-foreground ml-auto">{severity.low || 0}</span>
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
          <CardTitle>Mistake Trend (7d)</CardTitle>
          <CardDescription>Your mistake frequency over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-medium">Improving: {trend[trend.length - 1] >= 50 ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last day: {trend[trend.length - 1]} mistakes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
