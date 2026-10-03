import { MemoryViewer } from "@/components/memory/MemoryViewer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { loadMemory } from "@/lib/server/memories";

interface MemoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Memory Details",
};

export default async function MemoryDetailPage({ params }: MemoryDetailPageProps) {
  const { id } = await params;
  const { memory, error } = await loadMemory(id);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Could not load this memory</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link href="/dashboard/overview">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!memory) {
    notFound();
  }

  return <MemoryViewer memory={memory} onClose={() => redirect("/dashboard/overview")} />;
}
