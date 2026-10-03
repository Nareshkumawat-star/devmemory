import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { loadMemories } from "@/lib/server/memories";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Your coding memory analytics and insights.",
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

export default async function AnalyticsPage() {
  const { memories, error } = await loadMemories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your coding mistakes, topics, and improvement over time.</p>
        </div>
        <NewMemoryButton />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load your analytics</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!error && memories.length === 0 && (
        <EmptyState
          title="No data to analyze yet"
          description="Once you save some memories, your mistake frequency, severity, and topic trends appear here."
          action={<NewMemoryButton />}
        />
      )}

      {!error && memories.length > 0 && <AnalyticsCharts memories={memories} />}
    </div>
  );
}
