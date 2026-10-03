import type { Metadata } from "next";
import { AskPanel } from "@/components/ai/AskPanel";

export const metadata: Metadata = {
  title: "Ask the AI",
  description: "Ask questions about your coding memories.",
};

import { Layout } from "@/components/layout/Layout";

export default function AskPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="pb-4 border-b border-slate-800/80 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Ask DevMemory AI</h1>
          <p className="mt-1.5 text-slate-400 text-sm max-w-xl mx-auto">
            Receive personalized answers strictly grounded in your own historical coding mistakes and solutions.
          </p>
        </div>

        <AskPanel />
      </div>
    </Layout>
  );
}