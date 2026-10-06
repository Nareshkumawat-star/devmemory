import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import VectorWordmark from "@/components/ui/vector-wordmark";

import { Link000, Link001 } from "@/components/ui/skiper-ui/skiper40";
import {
  Brain,
  Search,
  BarChart3,
  Dumbbell,
  AlertTriangle,
  MessageSquare,
  Zap,
  Code2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "DevMemory - RAG Coding Assistant",
  description:
    "DevMemory turns your past coding mistakes into personalized guidance with a RAG pipeline over your own coding memories.",
};

const features = [
  {
    icon: Brain,
    title: "AI Mistake Analysis",
    description:
      "Gemma analyzes your code snippets and stack traces to detect root causes, severity levels, and missed logic.",
  },
  {
    icon: Search,
    iconOffset: "-translate-x-0.5",
    title: "Atlas Vector Search",
    description:
      "Vector embeddings search your historical memories semantically, matching logic patterns rather than just keywords.",
  },
  {
    icon: MessageSquare,
    title: "Grounded Q&A",
    description:
      "Ask coding questions and receive answers strictly grounded in bugs and fixes you have personally encountered.",
  },
  {
    icon: AlertTriangle,
    title: "Recurring Bug Detection",
    description:
      "Every saved error is tagged and categorized so recurring anti-patterns surface automatically.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Track mistake frequency, severity trends, and topic weaknesses over days, weeks, and months.",
  },
  {
    icon: Dumbbell,
    title: "Personalized Practice",
    description:
      "Generate tailored coding practice problems targeting the exact concepts you struggle with most.",
  },
];

const pipeline = [
  { step: "01", title: "Save Memory", body: "Log your snippet, target problem description, and thrown error." },
  { step: "02", title: "AI Analysis", body: "Gemma extracts root cause, difficulty level, and key takeaways." },
  { step: "03", title: "Vector Embed", body: "Generates high-dimensional vector embeddings stored in MongoDB." },
  { step: "04", title: "Semantic Retrieval", body: "Atlas Vector Search fetches relevant historical solutions." },
  { step: "05", title: "Grounded Answer", body: "Get customized AI insights tailored to your exact memory base." },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto grid grid-cols-[auto_1fr_auto] h-16 max-w-7xl items-center px-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">
                <Code2 className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Dev<span className="text-blue-400">Memory</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium text-slate-300">
            <Link000 href="/dashboard/overview" className="hover:text-blue-400 transition-colors">
              Dashboard
            </Link000>
            <Link000 href="/memories/new" className="hover:text-blue-400 transition-colors">
              Save Memory
            </Link000>
            <Link000 href="/analytics" className="hover:text-blue-400 transition-colors">
              Analytics
            </Link000>
            <Link000 href="/practice" className="hover:text-blue-400 transition-colors">
              Practice
            </Link000>
          </nav>

          <div className="flex items-center justify-end gap-3">
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm">
              <Link href="/memories/new" className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" strokeWidth={2} />
                New Memory
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-14 gradient-bg-hero">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" strokeWidth={2} />
            <span>Powered by Gemma AI & Atlas Vector Search</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl max-w-4xl leading-tight text-white">
            Turn your coding mistakes into{" "}
            <span className="text-blue-400">your personal memory</span>
          </h1>

          <p className="max-w-2xl text-lg text-slate-400 leading-relaxed">
            DevMemory logs your coding errors, analyzes root causes with Gemma AI, and retrieves past solutions using vector search so you never make the same mistake twice.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-600/20 h-12 px-7">
              <Link href="/memories/new" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" strokeWidth={2} />
                Save your first memory
              </Link>
            </Button>
            <Link001 href="/dashboard/overview" className="text-blue-400 font-semibold text-base hover:text-blue-400">
              Explore Dashboard
            </Link001>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 w-full max-w-3xl">
            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 text-center">
              <div className="text-xl font-bold text-blue-400">RAG Pipeline</div>
              <div className="text-xs text-slate-400 mt-1">Vector Grounded</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 text-center">
              <div className="text-xl font-bold text-blue-400">Gemma AI</div>
              <div className="text-xs text-slate-400 mt-1">Root Cause Analysis</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 text-center">
              <div className="text-xl font-bold text-blue-400">100% Personal</div>
              <div className="text-xs text-slate-400 mt-1">Your Own History</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 text-center">
              <div className="text-xl font-bold text-blue-400">Analytics</div>
              <div className="text-xs text-slate-400 mt-1">Weakness Radar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="mx-auto w-full max-w-6xl px-6 py-14 border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            How the <span className="text-blue-400">RAG Pipeline</span> Works
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Every coding snippet you log flows seamlessly through a 5-step feedback loop.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 items-stretch">
          {pipeline.map((item) => (
            <div
              key={item.step}
              className="h-full rounded-xl border border-slate-800 bg-slate-800/40 p-5 flex flex-col justify-between hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full text-blue-400 bg-blue-500/10 border border-blue-500/20">
                  {item.step}
                </span>
                <CheckCircle2 className="h-4 w-4 text-slate-600" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-semibold text-base text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-slate-800 bg-slate-900/60 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Core Capabilities
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              Built with Next.js 16, Monaco Editor, MongoDB Vector Search, and Gemma AI.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="h-full flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-800/40 p-6 hover:border-blue-500/40 transition-colors"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20">
                    <feature.icon className={`h-5 w-5 ${feature.iconOffset ?? ""}`} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA Card */}
      <section className="mx-auto w-full max-w-5xl px-6 py-14">
        <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-8 sm:p-10 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-4">
              <Zap className="h-3.5 w-3.5 text-blue-400" strokeWidth={2} />
              <span>Get started immediately</span>
            </div>

            <h2 className="text-2xl font-bold sm:text-3xl text-white tracking-tight mb-3">
              Ready to stop repeating coding errors?
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Create your first memory now and let AI elevate your engineering productivity.
            </p>

            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-600/20 h-12 px-7">
              <Link href="/memories/new" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" strokeWidth={2} />
                Create a Memory Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 pt-8 pb-8 text-xs text-slate-500 overflow-hidden relative">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-6">
          {/* Vector Wordmark Footer Section */}
          <div className="w-full h-[200px] sm:h-[260px] rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 relative group">
            <VectorWordmark />
            <div className="absolute bottom-3 right-4 px-3 py-1 rounded-md bg-slate-900/90 border border-slate-800/60 text-[10px] font-mono text-slate-400 backdrop-blur-md pointer-events-none">
              Interactive Vector Typography
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2 font-semibold text-slate-300">
              <Code2 className="h-4 w-4 text-blue-500" strokeWidth={2} />
              <span>DevMemory</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400 font-normal">Personalized AI Coding Memory</span>
            </div>

            <p suppressHydrationWarning>© {new Date().getFullYear()} DevMemory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}