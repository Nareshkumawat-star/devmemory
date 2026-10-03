import { describe, it, expect } from "vitest";
import {
  createMemorySchema,
  analyzeMemorySchema,
  searchMemoriesSchema,
  askAIContextSchema,
  practiceSchema,
} from "@/lib/validations";

const validCode = [{ language: "python" as const, code: "print('hi')" }];

describe("createMemorySchema", () => {
  const valid = {
    userId: "user-1",
    type: "error",
    title: "Binary search infinite loop",
    problemDescription: "Loop never terminates",
    userApproach: "Used <= instead of <",
    code: validCode,
    errors: ["Time Limit Exceeded"],
    lessonLearned: "Always update both bounds",
    tags: ["binary-search"],
  };

  it("accepts a complete memory", () => {
    const result = createMemorySchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("treats difficulty as optional and defaults downstream", () => {
    const result = createMemorySchema.safeParse(valid);
    expect(result.success && result.data.difficulty).toBeUndefined();
  });

  it("rejects an empty title", () => {
    const result = createMemorySchema.safeParse({ ...valid, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing code block", () => {
    const result = createMemorySchema.safeParse({ ...valid, code: [] });
    expect(result.success).toBe(false);
  });

  it("rejects an unsupported language", () => {
    const result = createMemorySchema.safeParse({
      ...valid,
      code: [{ language: "ruby", code: "puts 1" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown memory type", () => {
    const result = createMemorySchema.safeParse({ ...valid, type: "ramble" });
    expect(result.success).toBe(false);
  });

  it("reports issues rather than errors on Zod v4", () => {
    const result = createMemorySchema.safeParse({ ...valid, title: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Array.isArray(result.error.issues)).toBe(true);
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});

describe("analyzeMemorySchema", () => {
  it("requires the fields the analyze route reads", () => {
    const result = analyzeMemorySchema.safeParse({
      userId: "user-1",
      memoryId: "mem-1",
      errors: ["segfault"],
      code: validCode,
      problemDescription: "crashed",
    });
    expect(result.success).toBe(true);
  });

  it("requires memoryId", () => {
    const result = analyzeMemorySchema.safeParse({
      userId: "user-1",
      errors: [],
      code: validCode,
      problemDescription: "crashed",
    });
    expect(result.success).toBe(false);
  });
});

describe("searchMemoriesSchema", () => {
  it("requires a non-empty query", () => {
    expect(searchMemoriesSchema.safeParse({ userId: "u", query: "" }).success).toBe(
      false,
    );
    expect(searchMemoriesSchema.safeParse({ userId: "u", query: "loops" }).success).toBe(
      true,
    );
  });

  it("caps the limit at 50", () => {
    expect(
      searchMemoriesSchema.safeParse({ userId: "u", query: "loops", limit: 51 }).success,
    ).toBe(false);
    expect(
      searchMemoriesSchema.safeParse({ userId: "u", query: "loops", limit: 50 }).success,
    ).toBe(true);
  });
});

describe("askAIContextSchema", () => {
  it("allows omitting memoryIds", () => {
    const result = askAIContextSchema.safeParse({ userId: "u", question: "why?" });
    expect(result.success && result.data.memoryIds).toBeUndefined();
  });

  it("rejects an empty question", () => {
    expect(askAIContextSchema.safeParse({ userId: "u", question: "" }).success).toBe(
      false,
    );
  });

  it("rejects more than 50 memory ids", () => {
    const memoryIds = Array.from({ length: 51 }, (_, i) => `m${i}`);
    expect(
      askAIContextSchema.safeParse({ userId: "u", question: "why?", memoryIds }).success,
    ).toBe(false);
  });
});

describe("practiceSchema", () => {
  it("accepts an empty payload beyond userId", () => {
    expect(practiceSchema.safeParse({ userId: "u" }).success).toBe(true);
  });

  it("rejects an invalid difficulty", () => {
    expect(
      practiceSchema.safeParse({ userId: "u", difficulty: "expert" }).success,
    ).toBe(false);
  });
});