/**
 * Local models (Gemma via Ollama) routinely wrap JSON in ``` fences or prefix
 * it with a sentence, even when the system prompt explicitly forbids it.
 * Prompting alone does not fix this, so we normalise the output here instead
 * of failing the whole request.
 */

/** Index of the `}` matching the `{` at `start`, or -1 if unbalanced. */
function findMatchingBrace(text: string, start: number): number {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i += 1) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function tryParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/**
 * Parse a JSON object out of raw model output.
 *
 * Tries, in order: the raw string, the string with markdown fences removed,
 * and finally the first balanced `{...}` block (which tolerates prose before
 * or after the JSON). Throws with a short excerpt of the input when none of
 * those yield an object.
 */
export function parseModelJson<T>(raw: string): T {
  const trimmed = raw.trim();

  const direct = tryParse(trimmed);
  if (direct !== undefined) return direct as T;

  const unfenced = trimmed
    .replace(/^```[a-zA-Z]*[ \t]*\r?\n?/, "")
    .replace(/\r?\n?```[ \t]*$/, "")
    .trim();

  const fenced = tryParse(unfenced);
  if (fenced !== undefined) return fenced as T;

  const start = unfenced.indexOf("{");
  if (start !== -1) {
    const end = findMatchingBrace(unfenced, start);
    if (end !== -1) {
      const embedded = tryParse(unfenced.slice(start, end + 1));
      if (embedded !== undefined) return embedded as T;
    }
  }

  throw new Error(
    `Model returned invalid JSON: ${trimmed.slice(0, 200) || "(empty response)"}`,
  );
}
