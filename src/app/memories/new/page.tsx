"use client";

import { useRouter } from "next/navigation";
import { MemoryEditor } from "@/components/memory/MemoryEditor";
import type { CreateMemoryInput } from "@/lib/validations";

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <MemoryEditor onSubmit={handleSubmit} />
    </div>
  );
}