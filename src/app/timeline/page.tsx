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

import { Layout } from "@/components/layout/Layout";

export default async function TimelinePage() {
  const { memories, error } = await loadMemories();
  const stats = buildTimelineStats(memories);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Improvement Timeline</h1>
            <p className="text-slate-400 mt-1 text-sm">Track your coding improvement and mistake reduction over time.</p>
          </div>
          <Button variant="outline" asChild className="border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-200">
            <Link href="/memories/new">
              <Calendar className="h-4 w-4 mr-2 text-blue-400" />
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
              <Card className="bg-slate-900/60 border-slate-800 text-slate-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-red-500/10 p-3">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-red-400">{stats.lastWeek}</p>
                      <p className="text-xs text-slate-400">Last 7 days</p>
                    </div>
                  </div>
                  <Progress value={stats.lastWeek} max={Math.max(stats.total, 1)} className="mt-4 bg-slate-800" />
                  <p className="text-xs text-slate-400 mt-2">
                    {stats.lastWeek} of {stats.total} total memories
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800 text-slate-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-500/10 p-3">
                      <TrendingUp className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-emerald-400">{stats.changePct}%</p>
                      <p className="text-xs text-slate-400">Prev 7 days trend</p>
                    </div>
                  </div>
                  <Progress value={Math.min(Math.abs(stats.changePct), 100)} className="mt-4 bg-slate-800" />
                  <p className="text-xs text-slate-400 mt-2">
                    {stats.changePct >= 0 ? "Fewer" : "More"} than the previous week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800 text-slate-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-500/10 p-3">
                      <Activity className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-blue-400">{stats.daysActive}</p>
                      <p className="text-xs text-slate-400">Days active</p>
                    </div>
                  </div>
                  <Progress value={stats.daysActive} max={7} className="mt-4 bg-slate-800" />
                  <p className="text-xs text-slate-400 mt-2">
                    {stats.daysActive} of 7 days with activity
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800 text-slate-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-indigo-500/10 p-3">
                      <Award className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-indigo-400">{stats.lessons}</p>
                      <p className="text-xs text-slate-400">Lessons logged</p>
                    </div>
                  </div>
                  <Progress value={stats.lessons} max={Math.max(stats.total, 1)} className="mt-4 bg-slate-800" />
                  <p className="text-xs text-slate-400 mt-2">
                    {stats.lessons} of {stats.total} total memories
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-slate-900/60 border-slate-800 text-slate-100">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Mistake Frequency (7 days)</CardTitle>
                  <CardDescription className="text-slate-400">Memories logged per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.frequency.map((value, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-xs text-slate-400 w-14 font-mono">
                          Day {i + 1}
                        </span>
                        <div className="flex-1">
                          <Progress
                            value={value}
                            max={stats.frequencyPeak}
                            className="h-3.5 bg-slate-800"
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-200">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800 text-slate-100">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Improvement Timeline</CardTitle>
                  <CardDescription className="text-slate-400">Memories saved each week over 8 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.weeks.map((mistakes, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-xs text-slate-400 w-16 font-mono">
                          Week {i + 1}
                        </span>
                        <div className="flex-1">
                          <Progress
                            value={mistakes}
                            max={stats.weekPeak}
                            className="h-3.5 bg-slate-800"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200">{mistakes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/60 border-slate-800 text-slate-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Overall Statistics</CardTitle>
                <CardDescription className="text-slate-400">Your coding progress at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                    <div className="rounded-lg bg-blue-500/10 p-3">
                      <FileCode className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.solved}</p>
                      <p className="text-xs text-slate-400">Total problems solved</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                    <div className="rounded-lg bg-amber-500/10 p-3">
                      <Lightbulb className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.lessons}</p>
                      <p className="text-xs text-slate-400">Lessons learned</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
