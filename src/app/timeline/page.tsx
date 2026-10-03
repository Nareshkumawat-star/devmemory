import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Calendar,
  FileCode,
  Lightbulb,
  AlertTriangle,
  Plus
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { loadMemories } from "@/lib/server/memories";
import { buildTimelineStats } from "@/lib/timeline";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Track your improvement over time.",
};

export default async function TimelinePage() {
  const { memories, error } = await loadMemories();
  const stats = buildTimelineStats(memories);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
          <p className="text-muted-foreground mt-1">Track your coding improvement over time.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/memories/new">
            <Calendar className="h-4 w-4 mr-2" />
            Log a Memory
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load your timeline</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!error && stats.total === 0 && (
        <EmptyState
          title="Nothing on your timeline yet"
          description="Save a few memories and this page will chart your mistakes and activity over time."
          action={
            <Button asChild>
              <Link href="/memories/new">
                <Plus className="h-4 w-4 mr-2" />
                New Memory
              </Link>
            </Button>
          }
        />
      )}

      {!error && stats.total > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-500/10 p-3">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-red-600">{stats.lastWeek}</p>
                    <p className="text-sm text-muted-foreground">Last week</p>
                  </div>
                </div>
                <Progress value={stats.lastWeek} max={Math.max(stats.total, 1)} className="mt-4" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.lastWeek} of {stats.total} memories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-500/10 p-3">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-600">{stats.changePct}%</p>
                    <p className="text-sm text-muted-foreground">Previous week</p>
                  </div>
                </div>
                <Progress value={Math.min(Math.abs(stats.changePct), 100)} className="mt-4" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.changePct >= 0 ? "Fewer" : "More"} than the previous 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <Activity className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-600">{stats.daysActive}</p>
                    <p className="text-sm text-muted-foreground">Days active</p>
                  </div>
                </div>
                <Progress value={stats.daysActive} max={7} className="mt-4" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.daysActive} of 7 days with activity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/10 p-3">
                    <Award className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-purple-600">{stats.lessons}</p>
                    <p className="text-sm text-muted-foreground">Lessons learned</p>
                  </div>
                </div>
                <Progress value={stats.lessons} max={Math.max(stats.total, 1)} className="mt-4" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.lessons} of {stats.total} memories
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mistake Frequency (7 days)</CardTitle>
                <CardDescription>Memories saved each day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.frequency.map((value, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-12">
                        {i + 1} day
                      </span>
                      <div className="flex-1">
                        <Progress
                          value={value}
                          max={stats.frequencyPeak}
                          className="h-4"
                        />
                      </div>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Timeline</CardTitle>
                <CardDescription>Memories saved each week over 8 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.weeks.map((mistakes, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-20">
                        Week {i + 1}
                      </span>
                      <div className="flex-1">
                        <Progress
                          value={mistakes}
                          max={stats.weekPeak}
                          className="h-4"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{mistakes}</span>
                        {i < stats.weeks.length - 1 && (
                          <div className="text-xs text-muted-foreground">
                            {mistakes > stats.weeks[i + 1] ? (
                              <><TrendingDown className="h-3 w-3 inline mr-1" />{mistakes - stats.weeks[i + 1]} fewer</>
                            ) : mistakes < stats.weeks[i + 1] ? (
                              <><TrendingUp className="h-3 w-3 inline mr-1" />{stats.weeks[i + 1] - mistakes} more</>
                            ) : (
                              <span className="text-muted-foreground">no change</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Overall Statistics</CardTitle>
              <CardDescription>Your coding progress at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-3">
                    <FileCode className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.solved}</p>
                    <p className="text-sm text-muted-foreground">Total problems solved</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.lessons}</p>
                    <p className="text-sm text-muted-foreground">Lessons learned</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
