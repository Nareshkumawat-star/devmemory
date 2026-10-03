import type { CodingMemory } from "@/types";
import { problemsSolvedCount } from "@/lib/ai/analytics";

const DAY_MS = 86_400_000;
const WEEK_MS = 7 * DAY_MS;

export type TimelineStats = {
  /** Memories created in the last 7 days. */
  lastWeek: number;
  /** Percent change vs the previous 7 days; positive means fewer mistakes. */
  changePct: number;
  /** Distinct calendar days with activity in the last 7 days. */
  daysActive: number;
  lessons: number;
  total: number;
  solved: number;
  /** One bucket per day for the last week, oldest first. */
  frequency: number[];
  frequencyPeak: number;
  /** One bucket per week for the last 8 weeks, oldest first. */
  weeks: number[];
  weekPeak: number;
};

/**
 * Derive every figure shown on the timeline page from the stored memories.
 *
 * Lives in its own module because `Date.now()` is impure: calling it directly
 * inside a Server Component body makes `react-hooks/purity` fail the lint run.
 * Reading it here keeps render itself idempotent.
 */
export function buildTimelineStats(
  memories: CodingMemory[],
  now: number = Date.now(),
): TimelineStats {
  const age = (createdAt: Date) => now - new Date(createdAt).getTime();

  const lastWeek = memories.filter((m) => age(m.createdAt) < WEEK_MS);
  const previousWeek = memories.filter(
    (m) => age(m.createdAt) >= WEEK_MS && age(m.createdAt) < 2 * WEEK_MS,
  );

  const changePct =
    previousWeek.length === 0
      ? lastWeek.length === 0
        ? 0
        : 100
      : Math.round(
          ((previousWeek.length - lastWeek.length) / previousWeek.length) * 100,
        );

  const daysActive = new Set(
    lastWeek.map((m) => new Date(m.createdAt).toDateString()),
  ).size;

  const frequency = Array.from({ length: 7 }, (_, i) => {
    const from = i * DAY_MS;
    const to = from + DAY_MS;
    return lastWeek.filter(
      (m) => age(m.createdAt) >= from && age(m.createdAt) < to,
    ).length;
  });

  const weeks = Array.from({ length: 8 }, (_, i) => {
    const from = i * WEEK_MS;
    const to = from + WEEK_MS;
    return memories.filter(
      (m) => age(m.createdAt) >= from && age(m.createdAt) < to,
    ).length;
  });

  return {
    lastWeek: lastWeek.length,
    changePct,
    daysActive,
    lessons: memories.filter((m) => m.type === "lesson").length,
    total: memories.length,
    solved: problemsSolvedCount(memories),
    frequency,
    frequencyPeak: Math.max(...frequency, 1),
    weeks,
    weekPeak: Math.max(...weeks, 1),
  };
}
