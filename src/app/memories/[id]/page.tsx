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

import { Layout } from "@/components/layout/Layout";

export default async function MemoryDetailPage({ params }: MemoryDetailPageProps) {
  const { id } = await params;
  const { memory, error } = await loadMemory(id);

  if (error) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl space-y-6 py-6">
          <Alert variant="destructive">
            <AlertTitle>Could not load this memory</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button variant="outline" asChild className="border-slate-700 bg-slate-800 text-slate-200">
            <Link href="/dashboard/overview">Back to dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!memory) {
    notFound();
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl py-2">
        <MemoryViewer memory={memory} onClose={() => redirect("/dashboard/overview")} />
      </div>
    </Layout>
  );
}
