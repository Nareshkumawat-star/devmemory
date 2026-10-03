import type { Metadata } from "next";
import { AskPanel } from "@/components/ai/AskPanel";

export const metadata: Metadata = {
  title: "Ask the AI",
  description: "Ask questions about your coding memories.",
};

export default function AskPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Ask the AI</h1>
        <p className="mt-2 text-muted-foreground">
          Your coding memories power personalized answers.
        </p>
      </div>

      <AskPanel />
    </div>
  );
}