"use client";

import { useRouter } from "next/navigation";
import { MemoryEditor } from "@/components/memory/MemoryEditor";
import type { CreateMemoryInput } from "@/lib/validations";

import { Layout } from "@/components/layout/Layout";

export default function NewMemoryPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateMemoryInput) => {
    // Let errors propagate so MemoryEditor can surface them to the user.
    const response = await fetch("/api/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      throw new Error(error?.error || "Failed to create memory");
    }

    router.push("/dashboard/overview");
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="pb-4 border-b border-slate-800/80">
          <h1 className="text-3xl font-bold tracking-tight text-white">Save a Coding Memory</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Document coding errors, stack traces, and solutions to expand your personal AI memory base.
          </p>
        </div>
        <MemoryEditor onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
}