import { describe, it, expect } from "vitest";
import { cn, classNames, slugify, truncate, shuffle, pick, relativeTime } from "@/utils";

describe("cn", () => {
  it("joins conditional class names", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("resolves conflicting Tailwind utilities in favour of the last", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("returns an empty string with no input", () => {
    expect(cn()).toBe("");
  });
});

describe("classNames", () => {
  it("filters falsy values", () => {
    expect(classNames("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips leading and trailing separators", () => {
    expect(slugify("  --Binary Search!!  ")).toBe("binary-search");
  });
});

describe("truncate", () => {
  it("leaves short strings untouched", () => {
    expect(truncate("short", 20)).toBe("short");
  });

  it("truncates and appends an ellipsis", () => {
    const result = truncate("a".repeat(50), 10);
    expect(result).toHaveLength(11);
    expect(result.endsWith("…")).toBe(true);
  });
});

describe("shuffle", () => {
  it("returns a new array with the same members", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).not.toBe(input);
    expect([...result].sort((a, b) => a - b)).toEqual(input);
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3];
    shuffle(input);
    expect(input).toEqual([1, 2, 3]);
  });
});

describe("pick", () => {
  it("returns no duplicates", () => {
    const result = pick([1, 2, 3, 4, 5], 3);
    expect(result).toHaveLength(3);
    expect(new Set(result).size).toBe(3);
  });

  it("returns the whole array when n exceeds the length", () => {
    expect(pick([1, 2], 10)).toHaveLength(2);
  });

  it("returns nothing for an empty array", () => {
    expect(pick([], 3)).toEqual([]);
  });
});

describe("relativeTime", () => {
  it("describes recent timestamps in hours", () => {
    expect(relativeTime(Date.now() - 60 * 60 * 1000)).toContain("hour");
  });

  it("describes yesterday", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(relativeTime(yesterday)).toBe("yesterday");
  });

  it("accepts a Date as well as a number", () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(typeof relativeTime(date)).toBe("string");
  });
});