"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Code2, FileCode, AlertTriangle, Lightbulb, BookOpen, TrendingUp } from "lucide-react";
import { relativeTime } from "@/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CodingMemory } from "@/types";

interface MemoryViewerProps {
  memory: CodingMemory;
  onClose: () => void;
}

const languageMap: Record<string, string> = {
  cpp: "cpp",
  cplusplus: "cpp",
  python: "python",
  javascript: "javascript",
  js: "javascript",
  java: "java",
  typescript: "typescript",
  ts: "typescript",
};

function getTypeIcon(type: string) {
  switch (type) {
    case "error":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "lesson":
      return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    case "approach":
      return <BookOpen className="h-4 w-4 text-blue-500" />;
    case "probability":
      return <TrendingUp className="h-4 w-4 text-purple-500" />;
    default:
      return <FileCode className="h-4 w-4 text-muted-foreground" />;
  }
}

export function MemoryViewer({ memory, onClose }: MemoryViewerProps) {
  const code = memory.code?.[0];

  return (
    <Card className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {getTypeIcon(memory.type)}
              {memory.title}
            </CardTitle>
            <CardDescription>
              {memory.type} · {relativeTime(memory.createdAt)} · {memory.difficulty}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto space-y-4 p-4">
          {memory.problemDescription && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Problem</h4>
              <p className="text-sm">{memory.problemDescription}</p>
            </div>
          )}

          {memory.userApproach && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Approach</h4>
              <p className="text-sm">{memory.userApproach}</p>
            </div>
          )}

          {memory.errors && memory.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-red-600 uppercase tracking-wide">Errors</h4>
              <div className="space-y-1">
                {memory.errors.map((error, i) => (
                  <div key={i} className="text-sm bg-red-500/10 border border-red-500/20 rounded p-2">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {memory.lessonLearned && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Lesson Learned</h4>
              <p className="text-sm">{memory.lessonLearned}</p>
            </div>
          )}

          {code && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Submitted Code</h4>
                <span className="text-xs text-muted-foreground">
                  {languageMap[code.language] || code.language}
                </span>
              </div>
              <SyntaxHighlighter
                language={languageMap[code.language] || "plaintext"}
                style={coldarkDark}
                customStyle={{ margin: 0, borderRadius: "0.5rem", background: "#1a1a1a" }}
              >
                {code.code}
              </SyntaxHighlighter>
            </div>
          )}

          {memory.tags && memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {memory.tags.map((tag) => (
                <span key={tag} className="text-xs bg-muted rounded-full px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </Card>
  );
}
