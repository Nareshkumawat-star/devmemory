import { getGemmaConfig } from "@/lib/env";
import { parseModelJson } from "@/lib/ai/parseModelJson";
import type { Difficulty } from "@/lib/validations/memories";

const config = getGemmaConfig();

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.apiKey && config.apiKey !== "local") {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  return headers;
}

async function post<T>(path: string, body: unknown): Promise<T> {
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

  const result = await post<{ choices: Array<{ message: { content: string } }> }>("/chat/completions", body);

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

  if (!parsed || typeof parsed.problem !== "string" || !parsed.problem.trim()) {
    throw new Error("Gemma returned an empty practice recommendation.");
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
