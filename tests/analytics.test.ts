import { describe, it, expect } from "vitest";
import {
  mistakeFrequency,
  mistakeCategories,
  severityDistribution,
  topicWeakness,
  problemsSolvedCount,
  mistakeTrend,
  improvementTimeline,
  difficultyDistribution,
} from "@/lib/ai/analytics";
import type { CodingMemory } from "@/types";

function makeMemory(overrides: Partial<CodingMemory> = {}): CodingMemory {
  const now = new Date();
  return {
    _id: `mem-${Math.random().toString(36).slice(2)}`,
    userId: "user-1",
    type: "error",
    title: "A problem",
    problemDescription: "Something broke",
    userApproach: "I tried a thing",
    code: [{ language: "python", code: "x = 1" }],
    errors: ["TypeError"],
    lessonLearned: "Check types early",
    createdAt: now,
    updatedAt: now,
    tags: [],
    difficulty: "beginner",
    ...overrides,
  };
}

describe("mistakeFrequency", () => {
  it("counts memories per type", () => {
    const memories = [
      makeMemory({ type: "error" }),
      makeMemory({ type: "error" }),
      makeMemory({ type: "lesson" }),
    ];
    expect(mistakeFrequency(memories)).toEqual({ error: 2, lesson: 1 });
  });

  it("returns an empty object for no memories", () => {
    expect(mistakeFrequency([])).toEqual({});
  });
});

describe("mistakeCategories", () => {
  it("deduplicates identical lessons", () => {
    const memories = [
      makeMemory({ lessonLearned: "Check types early" }),
      makeMemory({ lessonLearned: "Check types early" }),
      makeMemory({ lessonLearned: "Avoid globals" }),
    ];
    expect(mistakeCategories(memories)).toEqual([
      "check types early",
      "avoid globals",
    ]);
  });
});

describe("severityDistribution", () => {
  it("maps types to severity buckets as counts, not arrays", () => {
    const memories = [
      makeMemory({ type: "error" }),
      makeMemory({ type: "error" }),
      makeMemory({ type: "lesson" }),
      makeMemory({ type: "approach" }),
    ];

    const result = severityDistribution(memories);
    expect(result).toEqual({ low: 1, medium: 1, high: 2 });
  });

  it("always returns all three buckets", () => {
    expect(severityDistribution([])).toEqual({ low: 0, medium: 0, high: 0 });
  });
});

describe("topicWeakness", () => {
  it("groups by lesson topic", () => {
    const memories = [
      makeMemory({ lessonLearned: "Check types early" }),
      makeMemory({ lessonLearned: "Check types early" }),
    ];
    expect(topicWeakness(memories)).toEqual({ "Check types early": 2 });

    // Empty/blank lessons and memories with no tags + no lesson are ignored,
    // never reported as a blank topic.
    const mixed = [
      makeMemory({ lessonLearned: "" }),
      makeMemory({ lessonLearned: "  " }),
      makeMemory({ tags: ["maps"], lessonLearned: "" }), // tags win, empty lesson ignored
      makeMemory({}), // defaults to lessonLearned "Check types early" from helper (1 copy)
    ];
    expect(topicWeakness(mixed)).toEqual({ "Check types early": 1, maps: 1 });

    // topicWeakness is case-preserving; it does not lowercase keys.
    const caseMixed = [
      makeMemory({ lessonLearned: "Use strict" }),
      makeMemory({ lessonLearned: "use strict" }),
    ];
    expect(topicWeakness(caseMixed)).toEqual({ "Use strict": 1, "use strict": 1 });

    // Tags take precedence over lessonLearned for the topic name.
    const tagged = [
      makeMemory({ tags: ["arrays"], lessonLearned: "ignored" }),
      makeMemory({ tags: ["arrays"], lessonLearned: "also ignored" }),
    ];
    expect(topicWeakness(tagged)).toEqual({ arrays: 2 });

  });
});

describe("problemsSolvedCount", () => {
  it("counts distinct problems rather than memory rows", () => {
    const memories = [
      makeMemory({ title: "Binary search" }),
      makeMemory({ title: "binary search" }),
      makeMemory({ title: "Graph BFS" }),
    ];
    expect(problemsSolvedCount(memories)).toBe(2);
  });

  it("is zero with no memories", () => {
    expect(problemsSolvedCount([])).toBe(0);
  });
});

describe("mistakeTrend", () => {
  it("always returns one percentage per bucket", () => {
    const points = mistakeTrend([makeMemory()], "7d");
    expect(points).toHaveLength(7);
    for (const point of points) {
      expect(point).toBeGreaterThanOrEqual(0);
      expect(point).toBeLessThanOrEqual(100);
    }
  });

  it("excludes memories older than the window", () => {
    const old = makeMemory({
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    });
    const points = mistakeTrend([old], "7d");
    expect(points.every((point) => point === 0)).toBe(true);
  });
});

describe("improvementTimeline", () => {
  it("returns one point per day for the 7d range", () => {
    expect(improvementTimeline([makeMemory()], "7d")).toHaveLength(7);
  });

  it("returns one point per day for the 90d range", () => {
    expect(improvementTimeline([makeMemory()], "90d")).toHaveLength(90);
  });
});

describe("difficultyDistribution", () => {
  it("counts memories at the given difficulty", () => {
    const memories = [
      makeMemory({ difficulty: "beginner" }),
      makeMemory({ difficulty: "beginner" }),
      makeMemory({ difficulty: "advanced" }),
    ];

    expect(difficultyDistribution(memories, "beginner")).toBe(2);
    expect(difficultyDistribution(memories, "advanced")).toBe(1);
    expect(difficultyDistribution(memories, "intermediate")).toBe(0);
  });
});