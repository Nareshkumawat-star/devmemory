import type { CodingMemory, Difficulty } from "@/types";

const severityMap: Record<CodingMemory["type"], "low" | "medium" | "high"> = {
  error: "high",
  lesson: "medium",
  approach: "low",
  probability: "medium",
};

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const group = key(item);
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
  }
  return groups;
}

export function mistakeFrequency(mistakes: CodingMemory[]): Record<string, number> {
  const groups = groupBy(mistakes, (memory) => memory.type);
  return Object.fromEntries(
    Object.entries(groups).map(([type, memories]) => [type, memories.length]),
  ) as Record<string, number>;
}

export function mistakeCategories(memories: CodingMemory[]): string[] {
  const categories = new Set<string>();
  for (const memory of memories) {
    categories.add(memory.lessonLearned.toLowerCase().slice(0, 60));
  }
  return [...categories];
}

export function severityDistribution(memories: CodingMemory[]): Record<string, number> {
  const groups = groupBy(memories, (memory) => severityMap[memory.type] || "low");
  const output: Record<string, number> = { low: 0, medium: 0, high: 0 };

  for (const [severity, group] of Object.entries(groups)) {
    if (severity in output) {
      output[severity] = group.length;
    }
  }

  return output;
}

export function topicWeakness(mistakes: CodingMemory[]): Record<string, number> {
  
  /**
   * Group by tags (a real per-memory field), falling back to lessonLearned
   * only when the memory has no tags.
   *
   * The old implementation bucketed on lessonLearned, which left a phantom
   * "" (empty-string) key for memories saved without a lesson. That empty key
   * leaked into API responses (mistakesByTopic: {"": N}) and the dashboard
   * card status empty labels. This drops those and only reports real topics.
   */
  const groups: Record<string, number> = {};

  for (const memory of mistakes) {
    const topic =
      memory.tags && memory.tags.length > 0 ? memory.tags[0] : memory.lessonLearned.trim();
    if (!topic) continue;
    groups[topic] = (groups[topic] ?? 0) + 1;
  }

  return Object.fromEntries(
    Object.entries(groups).map(([topic, count]) => [topic, count]),
  ) as Record<string, number>;
}

export function problemsSolvedCount(memories: CodingMemory[]): number {
  return new Set(memories.map((memory) => memory.title.trim().toLowerCase())).size;
}

export function mistakeTrend(mistakes: CodingMemory[], range: "7d" | "30d" | "90d" = "7d"): number[] {
  const points: number[] = [];
  const now = Date.now();
  const windowMs =
    range === "7d" ? 7 * 24 * 60 * 60 * 1000 :
    range === "30d" ? 30 * 24 * 60 * 60 * 1000 :
    90 * 24 * 60 * 60 * 1000;

  const since = now - windowMs;
  const recent = mistakes.filter((memory) => new Date(memory.createdAt).getTime() >= since);

  const buckets = 7;
  const counts = new Array(buckets).fill(0);
  const maxCount = recent.length || 1;

  recent.forEach((memory) => {
    const index = Math.floor((new Date(memory.createdAt).getTime() - since) / (windowMs / buckets));
    if (index >= 0 && index < buckets) counts[index] += 1;
  });

  for (let i = 0; i < buckets; i += 1) {
    points.push(Math.round((counts[i] / maxCount) * 100));
  }

  return points;
}

export function improvementTimeline(mistakes: CodingMemory[], range: "7d" | "30d" | "90d" = "7d"): number[] {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const buckets = days;
  const now = Date.now();
  const windowMs = days * 24 * 60 * 60 * 1000;
  const since = now - windowMs;

  const counts = new Array(buckets).fill(0);

  for (const memory of mistakes) {
    const timestamp = new Date(memory.createdAt).getTime();
    if (timestamp < since) continue;
    const index = Math.floor((timestamp - since) / (windowMs / buckets));
    if (index >= 0 && index < buckets) counts[index] += 1;
  }

  const runningTotal: number[] = [];
  let total = 0;
  for (let i = buckets - 1; i >= 0; i -= 1) {
    total += counts[i];
    runningTotal.push(total);
  }

  return runningTotal.map((value) => Math.round((value / Math.max(counts[0], 1)) * 100));
}

export function difficultyDistribution(mistakes: CodingMemory[], difficulty: Difficulty): number {
  return mistakes.filter((memory) => memory.difficulty === difficulty).length;
}
