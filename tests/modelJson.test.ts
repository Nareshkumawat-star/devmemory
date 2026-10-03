import { describe, it, expect } from "vitest";
import { parseModelJson } from "@/lib/ai/parseModelJson";

describe("parseModelJson", () => {
  it("passes through already-valid JSON", () => {
    expect(parseModelJson('{"a": 1}')).toEqual({ a: 1 });
  });

  it("strips a ```json fence, which local models emit despite instructions", () => {
    const raw =
      '```json\n{"problem": "Sum evens", "tests": ["[1,2] -> 2"]}\n```';
    expect(parseModelJson<{ problem: string }>(raw).problem).toBe("Sum evens");
  });

  it("strips an unfenced ``` block", () => {
    expect(parseModelJson('```\n{"a": 1}\n```')).toEqual({ a: 1 });
  });

  it("extracts JSON preceded by prose", () => {
    const raw = 'Here is your problem: {"a": 1} Hope that helps!';
    expect(parseModelJson(raw)).toEqual({ a: 1 });
  });

  it("extracts JSON followed by prose", () => {
    const raw = '{"a": {"b": 2}} let me know if you want another.';
    expect(parseModelJson(raw)).toEqual({ a: { b: 2 } });
  });

  it("ignores braces inside string values", () => {
    const raw = 'Sure! {"text": "use { } braces"} done';
    expect(parseModelJson<{ text: string }>(raw).text).toBe("use { } braces");
  });

  it("handles escaped quotes inside strings", () => {
    const raw = '`{"msg": "say \\"hi\\""}`';
    expect(parseModelJson<{ msg: string }>(raw).msg).toBe('say "hi"');
  });

  it("throws a readable error for non-JSON output", () => {
    expect(() => parseModelJson("I cannot answer that.")).toThrow(
      /invalid JSON: I cannot answer that\./,
    );
  });

  it("throws for an empty response", () => {
    expect(() => parseModelJson("   ")).toThrow(/empty response/);
  });

  it("throws when braces are unbalanced", () => {
    expect(() => parseModelJson('{"a": ')).toThrow(/invalid JSON/);
  });
});
