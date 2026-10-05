import { getGemmaConfig } from "@/lib/env";
import { parseModelJson } from "@/lib/ai/parseModelJson";

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

export interface AnalyzeMemoryRequest {
  code: string;
  errors: string[];
  problemDescription: string;
  pointsToAnalyze?: string[];
}

export interface AnalyzeMemoryResponse {
  rootCauses: string[];
  mistakeCategories: string[];
  severity: "low" | "medium" | "high";
  suggestedFix: string;
  learnings: string[];
}

const SystemPrompt = `You are an expert coding mentor. Your job is to analyze a student's code, their error messages, and the problem description.

Return a JSON object with the following shape:
{
  "rootCauses": string[],
  "mistakeCategories": string[],
  "severity": "low" | "medium" | "high",
  "suggestedFix": string,
  "learnings": string[]
}

Rules:
- Be concise and concrete.
- Reference the specific error or failing test when it is provided.
- Give a single, actionable suggested fix.
- Do not add markdown fences or extra keys.`;

export async function analyzeCodingMemory({
  code,
  errors,
  problemDescription,
  pointsToAnalyze,
}: AnalyzeMemoryRequest): Promise<AnalyzeMemoryResponse> {
  const config = getGemmaConfig();
  if (!config.baseUrl) {
    throw new Error("GEMMA_API_URL is not configured");
  }

  const userPrompt = [
    "Problem description:",
    problemDescription,
    "",
    "User approach:",
    code,
    "",
    "Errors:",
    errors.length ? errors.join("\n") : "None",
    "",
    "Points to analyze (optional):",
    pointsToAnalyze?.join(", ") || "root cause, mistake categories, severity, suggested fix, learnings",
  ].join("\n");

  const messages = [
    { role: "system", content: SystemPrompt },
    { role: "user", content: userPrompt },
  ];

  const body = {
    model: config.model,
    messages,
    temperature: 0.2,
    max_tokens: 1024,
  };

  const result = await post<{ choices: Array<{ message: { content: string } }> }>("/chat/completions", body);

  if (!result.choices?.[0]?.message?.content) {
    throw new Error("Gemma returned an empty analysis.");
  }

  let parsed: AnalyzeMemoryResponse;
  try {
    parsed = parseModelJson<AnalyzeMemoryResponse>(
      result.choices[0].message.content,
    );
  } catch (error) {
    throw new Error(`Gemma returned invalid JSON: ${error}`);
  }

  if (!parsed || typeof parsed.suggestedFix !== "string") {
    throw new Error("Gemma returned an analysis without a suggested fix.");
  }

  return parsed;
}
