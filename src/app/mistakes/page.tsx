import { MemoryCard } from "@/components/memory/MemoryCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { loadMemories } from "@/lib/server/memories";

export const metadata: Metadata = {
  title: "Mistakes",
  description: "View and analyze your coding mistakes.",
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

import { Layout } from "@/components/layout/Layout";

export default async function MistakesPage() {
  const { memories, error } = await loadMemories();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Coding Mistakes Log</h1>
            <p className="text-slate-400 mt-1 text-sm">View all saved errors, root causes, and key lessons learned.</p>
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
            title="No mistakes logged yet"
            description="Save a memory the next time you hit a bug — it will be listed here."
            action={<NewMemoryButton />}
          />
        )}

        {!error && memories.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {memories.map((memory) => (
              <MemoryCard key={memory._id} memory={memory} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
