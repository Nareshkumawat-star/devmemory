import { describe, it, expect } from "vitest";
import { l2Normalize, chunkText, buildSearchText, chunkMemoryToTexts } from "@/lib/embeddings/embed";

describe("l2Normalize", () => {
  it("produces a unit-length vector", () => {
    const result = l2Normalize([3, 4]);
    expect(result[0]).toBeCloseTo(0.6);
    expect(result[1]).toBeCloseTo(0.8);

    const magnitude = Math.sqrt(result.reduce((sum, v) => sum + v * v, 0));
    expect(magnitude).toBeCloseTo(1);
  });

  it("returns the input unchanged when the magnitude is zero", () => {
    const input = [0, 0, 0];
    expect(l2Normalize(input)).toEqual(input);
  });

  it("handles an empty vector", () => {
    expect(l2Normalize([])).toEqual([]);
  });
});

describe("chunkText", () => {
  it("returns no chunks for empty or whitespace input", () => {
    expect(chunkText("")).toEqual([]);
    expect(chunkText("   \n\t ")).toEqual([]);
  });

  it("returns a single chunk when text is shorter than the chunk size", () => {
    const chunks = chunkText("short text", 500, 100);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe("short text");
  });

  it("splits long text into multiple chunks", () => {
    const chunks = chunkText("a".repeat(1500), 500, 100);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it("collapses whitespace so chunks are single-line", () => {
    const chunks = chunkText("a\n\n  b\tc", 500, 100);
    expect(chunks[0]).toBe("a b c");
  });
});

describe("buildSearchText", () => {
  const memory = {
    type: "error",
    title: "Off by one",
    problemDescription: "Loop skipped the last element",
    userApproach: "Used <= with an index into a sorted array",
    errors: ["IndexError"],
    lessonLearned: "Prefer half-open ranges",
    code: [{ language: "python" as const, code: "for i in range(n + 1):" }],
  };

  it("includes the title and lesson", () => {
    const text = buildSearchText(memory);
    expect(text).toContain("Off by one");
    expect(text).toContain("Prefer half-open ranges");
  });

  it("includes the code with its language label", () => {
    expect(buildSearchText(memory)).toContain("python: for i in range(n + 1):");
  });

  it("uppercases the memory type", () => {
    expect(buildSearchText(memory)).toContain("ERROR");
  });

  it("tolerates an empty code array", () => {
    expect(buildSearchText({ ...memory, code: [] })).toContain("Off by one");
  });
});

describe("chunkMemoryToTexts", () => {
  it("produces at least one chunk for a populated memory", () => {
    const chunks = chunkMemoryToTexts({
      type: "error",
      title: "Off by one",
      problemDescription: "Skipped last element",
      userApproach: "Wrong bound",
      errors: ["IndexError"],
      lessonLearned: "Half-open ranges",
      code: [{ language: "python", code: "range(n + 1)" }],
    });

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.join(" ")).toContain("Half-open ranges");
  });

  it("renders code blocks with their language rather than raw objects", () => {
    const chunks = chunkMemoryToTexts({
      type: "lesson",
      title: "t",
      problemDescription: "p",
      userApproach: "a",
      errors: [],
      lessonLearned: "l",
      code: [{ language: "java", code: "int x = 1;" }],
    });

    expect(chunks.join(" ")).toContain("java: int x = 1;");
  });
});