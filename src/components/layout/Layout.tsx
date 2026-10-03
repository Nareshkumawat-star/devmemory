import { Navigation } from "@/components/layout/Navigation";
import { Code2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
      <Navigation />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="max-w-7xl mx-auto space-y-8" suppressHydrationWarning>
          {title && (
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 py-6 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-slate-300">
            <Code2 className="h-4 w-4 text-blue-500" />
            <span>DevMemory — AI RAG Coding Assistant</span>
          </div>
          <p suppressHydrationWarning>© {new Date().getFullYear()} DevMemory — All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
