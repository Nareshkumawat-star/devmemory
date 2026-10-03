import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { PracticePanel } from "@/components/ai/PracticePanel";
import { BookOpen, Lightbulb, Plus, Target, TrendingUp, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { loadMemories } from "@/lib/server/memories";
import { topicWeakness } from "@/lib/ai/analytics";
import type { CodingMemory } from "@/types";

export const metadata: Metadata = {
  title: "Practice",
  description: "Personalized coding practice generated from your memories.",
};

function NewMemoryButton() {
  return (
    <Button asChild>
      <Link href="/memories/new">
        <Plus className="h-4 w-4 mr-2" />
        New Memory
      </Link>
    </Button>
  );
}

function BackToDashboardButton() {
  return (
    <Button asChild variant="outline">
      <Link href="/">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>
    </Button>
  );
}

type Insight = {
  icon: "trending" | "lightbulb" | "target";
  accent: string;
  title: string;
  detail: string;
};

/**
 * Derived from what the user actually saved — repeated lessons, recurring
 * weak topics, and the most recent mistake — instead of hardcoded copy.
 */
function buildInsights(memories: CodingMemory[]): Insight[] {
  const insights: Insight[] = [];

  const lessonsByCount = new Map<string, number>();
  for (const memory of memories) {
    const lesson = memory.lessonLearned.trim();
    if (!lesson) continue;
    lessonsByCount.set(lesson, (lessonsByCount.get(lesson) ?? 0) + 1);
  }
  const repeated = [...lessonsByCount.entries()].sort((a, b) => b[1] - a[1]);

  if (repeated.length > 0) {
    const [lesson, count] = repeated[0];
    insights.push({
      icon: "trending",
      accent: "text-green-500",
      title: count > 1 ? `Repeated pattern (${count} times)` : "Most recent lesson",
      detail: lesson,
    });
  }

  // topicWeakness groups on lessonLearned, so memories saved without one
  // land in an empty-string bucket that would render as a blank label.
  const weakTopics = Object.entries(topicWeakness(memories))
    .filter(([topic]) => topic.trim().length > 0)
    .sort((a, b) => b[1] - a[1]);
  if (weakTopics.length > 0) {
    const [topic, count] = weakTopics[0];
    insights.push({
      icon: "target",
      accent: "text-purple-500",
      title: "Topic weakness",
      detail: `${topic} — ${count} ${count === 1 ? "memory" : "memories"} logged.`,
    });
  } else {
    const tagged = [...new Set(memories.flatMap((memory) => memory.tags))];
    if (tagged.length > 0) {
      insights.push({
        icon: "target",
        accent: "text-purple-500",
        title: "Topics you are tracking",
        detail: tagged.slice(0, 6).join(", "),
      });
    }
  }

  const lastMistake = memories.find((memory) => memory.type === "error");
  if (lastMistake) {
    insights.push({
      icon: "lightbulb",
      accent: "text-blue-500",
      title: `Latest error: ${lastMistake.title}`,
      detail:
        lastMistake.lessonLearned.trim() ||
        lastMistake.problemDescription.trim().slice(0, 160) ||
        "Review this memory and add what you learned.",
    });
  }

  return insights;
}

const insightIcons = {
  trending: TrendingUp,
  lightbulb: Lightbulb,
  target: Target,
} as const;

export default async function PracticePage() {
  const { memories, error } = await loadMemories();
  const insights = buildInsights(memories);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice</h1>
          <p className="text-muted-foreground mt-1">
            Personalized coding problems generated from your coding history.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <NewMemoryButton />
          <BackToDashboardButton />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load your memories</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!error && memories.length === 0 && (
        <EmptyState
          title="Nothing to practice from yet"
          description="Save a memory about a bug or lesson first — practice problems are generated from your own coding history."
          action={<NewMemoryButton />}
        />
      )}

      {!error && memories.length > 0 && (
        <>
          <PracticePanel hasMemories={memories.length > 0} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Your History
              </CardTitle>
              <CardDescription>
                Mistakes and lessons that inform your practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insights.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Add a lesson learned to your memories and your recurring
                  patterns will show up here.
                </p>
              ) : (
                <div className="space-y-3">
                  {insights.map((insight, index) => {
                    const Icon = insightIcons[insight.icon];
                    return (
                      <div key={index} className="p-4 rounded-md bg-muted/30">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Icon className={`h-4 w-4 ${insight.accent}`} />
                          <span>{insight.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {insight.detail}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
