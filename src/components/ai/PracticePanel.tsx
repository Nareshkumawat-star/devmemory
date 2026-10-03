"use client";

import { useCallback, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code2, Lightbulb, RefreshCw, Target } from "lucide-react";
import type { Difficulty } from "@/lib/validations/memories";

type GeneratedProblem = {
  problem: string;
  approachHint: string;
  constraints: string;
  tests: string[];
  rationale: string;
  difficulty: Difficulty;
  sourceCount: number;
};

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

interface PracticePanelProps {
  /** False when the user has no memories to base a problem on. */
  hasMemories: boolean;
}

export function PracticePanel({ hasMemories }: PracticePanelProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [problem, setProblem] = useState<GeneratedProblem | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/ai/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "current-user", difficulty }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } & Partial<GeneratedProblem> | null;

      if (!response.ok || !data?.problem) {
        throw new Error(data?.error || "Failed to generate a practice problem.");
      }

      setProblem(data as GeneratedProblem);
    } catch (error) {
      setProblem(null);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to generate a practice problem.",
      );
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Current Practice Problem
        </CardTitle>
        <CardDescription>
          Generated from your personal coding memories
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="practice-difficulty">Difficulty</Label>
          <Select
            id="practice-difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            {difficultyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Could not generate a problem</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {!problem && !errorMessage && (
          <div className="rounded-md bg-muted/30 p-6 text-center">
            <Target className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">No problem generated yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasMemories
                ? "Pick a difficulty and generate one — it will be tailored to your saved memories."
                : "Save a memory first, then generate a problem based on what you learned."}
            </p>
          </div>
        )}

        {problem && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{problem.difficulty}</Badge>
              <Badge variant="secondary">{problem.sourceCount} memories used</Badge>
            </div>

            <div className="space-y-2">
              <Label>Problem</Label>
              <div className="rounded-md bg-muted/30 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {problem.problem}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Approach</Label>
              <div className="rounded-md bg-muted/30 p-4">
                <p className="text-sm whitespace-pre-wrap">{problem.approachHint}</p>
                {problem.rationale && (
                  <div className="flex items-start gap-2 mt-3 text-xs text-muted-foreground">
                    <Lightbulb className="h-4 w-4 shrink-0 text-yellow-500 mt-0.5" />
                    <span>{problem.rationale}</span>
                  </div>
                )}
              </div>
            </div>

            {problem.constraints && (
              <div className="space-y-2">
                <Label>Constraints</Label>
                <div className="rounded-md bg-muted/30 p-4">
                  <p className="text-sm whitespace-pre-wrap">{problem.constraints}</p>
                </div>
              </div>
            )}

            {problem.tests.length > 0 && (
              <div className="space-y-2">
                <Label>Example Test Cases</Label>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {problem.tests.map((test, index) => (
                    <li key={index}>{test}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button onClick={generate} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : problem ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New Problem
            </>
          ) : (
            <>
              <Code2 className="h-4 w-4 mr-2" />
              Generate Problem
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
