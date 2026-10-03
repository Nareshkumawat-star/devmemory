import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { MemoryCard } from "@/components/memory/MemoryCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { loadMemories } from "@/lib/server/memories";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your coding memory analytics dashboard.",
};

function NewMemoryButton() {
  return (
    <Button asChild>
      <Link href="/memories/new">
        <Plus className="h-4 w-4 mr-2" />
        New Memory
      </Link>
    </Button>
  );
}

export default async function OverviewPage() {
  const { memories, error } = await loadMemories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your coding mistakes, progress, and improvement over time.</p>
        </div>
        <NewMemoryButton />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load your memories</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!error && memories.length === 0 && (
        <EmptyState
          title="No memories yet"
          description="Save your first coding mistake, lesson, or approach and it will show up here."
          action={<NewMemoryButton />}
        />
      )}

      {!error && memories.length > 0 && (
        <>
          <AnalyticsDashboard memories={memories} />

          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle>Recent Memories</CardTitle>
              <CardDescription>Your latest coding mistakes and lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memories.map((memory) => (
                  <MemoryCard key={memory._id} memory={memory} />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
