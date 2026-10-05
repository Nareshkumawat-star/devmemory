import { getGemmaConfig } from "@/lib/env";
import { parseModelJson } from "@/lib/ai/parseModelJson";
import type { Difficulty } from "@/lib/validations/memories";

function buildHeaders(): Record<string, string> {
  const config = getGemmaConfig();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.apiKey && config.apiKey !== "local") {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  return headers;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const config = getGemmaConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Gemma API error: ${response.status} ${bodyText}`);
  }

  return response.json() as Promise<T>;
}

export interface PracticeRecommendationRequest {
  difficulty?: Difficulty;
  topics: string[];
  excludeMemoryIds: string[];
  context: string;
}

export interface PracticeRecommendationResponse {
  problem: string;
  approachHint: string;
  constraints: string;
  tests: string[];
  rationale: string;
  difficulty: Difficulty;
}

const SystemPrompt = `You are a coding practice generator. You generate a single coding practice problem with a suggested approach and tests.

Return a JSON object with this exact shape:
{
  "problem": string,
  "approachHint": string,
  "constraints": string,
  "tests": string[],
  "rationale": string,
  "difficulty": "beginner" | "intermediate" | "advanced"
}

Rules:
- Do not emit markdown fences. Emit raw JSON.
- The tests array should contain plain-text unit test descriptions, not code.
- Tailor the difficulty to the given topic and context.`;

export async function generatePractice({
  difficulty,
  topics,
  excludeMemoryIds,
  context,
}: PracticeRecommendationRequest): Promise<PracticeRecommendationResponse> {
  const config = getGemmaConfig();
  if (!config.baseUrl) {
    throw new Error("GEMMA_API_URL is not configured");
  }

  const userPrompt = [
    "You are creating a coding practice problem for a learner. Use their history and preferences.",
    "",
    "Difficulty:",
    difficulty ?? "intermediate",
    "",
    "Topics:",
    topics.join(", "),
    "",
    "Exclude these memory IDs:",
    excludeMemoryIds.join(", ") || "none",
    "",
    "Context:",
    context,
    "",
    "Return exactly one fresh practice problem and its tests.",
  ].join("\n");

  const messages = [
    { role: "system", content: SystemPrompt },
    { role: "user", content: userPrompt },
  ];

  const body = {
    model: config.model,
    messages,
    temperature: 0.45,
    max_tokens: 1024,
  };

  const result = await post<{ choices: Array<{ message: { content: string } }> }>(
    "/chat/completions",
    body,
  );

  if (!result.choices?.[0]?.message?.content) {
    throw new Error("Gemma returned an empty practice recommendation.");
  }

  let parsed: PracticeRecommendationResponse;
  try {
    parsed = parseModelJson<PracticeRecommendationResponse>(
      result.choices[0].message.content,
    );
  } catch (error) {
    throw new Error(`Gemma returned invalid JSON: ${error}`);
  }

  const requestedDifficulty: Difficulty = difficulty ?? "intermediate";

  const modelDifficulty = parsed.difficulty;
  const resolvedDifficulty: Difficulty =
    modelDifficulty === "beginner" ||
    modelDifficulty === "intermediate" ||
    modelDifficulty === "advanced"
      ? modelDifficulty
      : requestedDifficulty;

  return {
    problem: parsed.problem,
    approachHint: parsed.approachHint,
    constraints: parsed.constraints,
    tests: parsed.tests || [],
    rationale: parsed.rationale,
    difficulty: resolvedDifficulty,
  };
}

/**
 * Gemma sometimes emits prose, markdown fences, or code blocks around its
 * JSON even when told not to. This retries with a stricter, short prompt so
 * the caller gets a clean recommendation instead of a 502.
 */
async function generatePracticeWithRetry(
  difficulty: Difficulty,
  topics: string[],
  excludeMemoryIds: string[],
  context: string,
): Promise<PracticeRecommendationResponse> {
  const maxAttempts = 2;
  let resolvedDifficulty: Difficulty = difficulty ?? "intermediate";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await generatePractice({
      difficulty: resolvedDifficulty,
      topics,
      excludeMemoryIds,
      context,
    });

    // The model occasionally ignores the shape instruction and pastes a full
    // explanation plus a code block. Catch those, and retry with a stricter
    // prompt that forbids extra text.
    if (
      result.problem.includes("\n") ||
      result.problem.includes("```") ||
      result.approachHint.includes("\n") ||
      result.tests.some((test) => test.includes("```"))
    ) {
      if (attempt === maxAttempts) return result;

      const retryPrompt =
        "Return ONLY a single JSON object. No markdown fences, no prose, no explanation. Shape:\n" +
        JSON.stringify(
          {
            problem: "short problem statement",
            approachHint: "one sentence",
            constraints: "comma separated",
            tests: ["plain test 1", "plain test 2"],
            rationale: "one sentence",
            difficulty: resolvedDifficulty,
          },
          null,
          2,
        );

      const retryConfig = getGemmaConfig();
      const retryBody = {
        model: retryConfig.model,
        messages: [
          {
            role: "system",
            content:
              `You are a coding practice generator. Return EXACTLY one JSON object only, no markdown fences, no prose, no code blocks.\n${retryPrompt}`,
          },
          {
            role: "user",
            content: [
              "Difficulty:", difficulty,
              "Topics:", topics.join(", ") || "none",
              "Exclude memory IDs:", excludeMemoryIds.join(", ") || "none",
              "Context:", context,
              "Return exactly one fresh practice problem and its tests. Raw JSON only.",
            ].join("\n"),
          },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      };

      const retryResult = await post<{ choices: Array<{ message: { content: string } }> }>(
        "/chat/completions",
        retryBody,
      );

      if (!retryResult.choices?.[0]?.message?.content) {
        throw new Error("Gemma returned an empty practice recommendation.");
      }

      const retryParsed = parseModelJson<PracticeRecommendationResponse>(
        retryResult.choices[0].message.content,
      );

      if (retryParsed && typeof retryParsed.problem === "string" && retryParsed.problem.trim()) {
        resolvedDifficulty =
          retryParsed.difficulty === "beginner" ||
          retryParsed.difficulty === "intermediate" ||
          retryParsed.difficulty === "advanced"
            ? retryParsed.difficulty
            : difficulty ?? "intermediate";

        return {
          problem: retryParsed.problem,
          approachHint: retryParsed.approachHint,
          constraints: retryParsed.constraints,
          tests: Array.isArray(retryParsed.tests) ? retryParsed.tests : [],
          rationale: retryParsed.rationale,
          difficulty: resolvedDifficulty,
        };
      }
    }

    return result;
  }

  throw new Error("Gemma returned an unreadable practice recommendation.");
}

