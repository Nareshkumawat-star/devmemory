import { env, type EmbeddingConfig } from "@/lib/env";
import type { CodeBlock } from "@/types";

const defaultConfig: EmbeddingConfig = {
  url: "https://api.openai.com/v1",
  key: "",
  model: "text-embedding-3-small",
};

function resolveConfig(): EmbeddingConfig {
  return env.EMBEDDING_API_URL
    ? { url: env.EMBEDDING_API_URL, key: env.EMBEDDING_API_KEY ?? "", model: env.EMBEDDING_MODEL ?? "text-embedding-3-small" }
    : defaultConfig;
}

const config = resolveConfig();

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.key && config.key !== "local") {
    headers.Authorization = `Bearer ${config.key}`;
  }

  return headers;
}

export interface EmbedInput {
  texts: string[];
  model?: string;
}

export interface EmbeddingResponse {
  data: Array<{ embedding: number[] }>;
}

export interface EmbedErrorResponse {
  error: { message: string; type: string };
}

export async function embedText(inputs: EmbedInput): Promise<number[][]> {
  if (!config.url) {
    throw new Error("EMBEDDING_API_URL is not configured");
  }

  const model = inputs.model || config.model;
  const payload = {
    model,
    input: inputs.texts,
  };

  const response = await fetch(`${config.url}/embeddings`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as EmbedErrorResponse;
    throw new Error(body.error?.message || `Embedding request failed: ${response.status}`);
  }

  const result = (await response.json()) as EmbeddingResponse;
  return result.data.map((item) => item.embedding);
}

export function l2Normalize(vector: number[]): number[] {
  let sum = 0;
  for (const value of vector) {
    sum += value * value;
  }
  const magnitude = Math.sqrt(sum);
  if (magnitude === 0) return vector;
  return vector.map((value) => value / magnitude);
}

export function chunkText(text: string, chunkSize = 500, overlap = 100): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const chunks: string[] = [];
  let start = 0;

  while (start < cleaned.length) {
    const end = Math.min(start + chunkSize, cleaned.length);
    chunks.push(cleaned.slice(start, end).trim());
    if (end === cleaned.length) break;
    start = end - overlap;
  }

  return chunks;
}

export function buildSearchText(memory: {
  type: string;
  title: string;
  problemDescription: string;
  userApproach: string;
  errors: string[];
  lessonLearned: string;
  code: CodeBlock[];
}): string {
  const parts = [
    memory.type ? memory.type.toUpperCase() : "",
    memory.title,
    memory.problemDescription,
    memory.userApproach,
    (memory.errors ?? []).join("; "),
    memory.lessonLearned,
  ].filter(Boolean);

  const codeText = memory.code?.map((block) => `${block.language}: ${block.code}`).join("\n") || "";

  return [parts.join(" "), codeText].join("\n\n");
}

export function chunkMemoryToTexts(memory: {
  type: string;
  title: string;
  problemDescription: string;
  userApproach: string;
  errors: string[];
  lessonLearned: string;
  code: CodeBlock[];
}): string[] {
  const parts = [
    memory.type ? memory.type.toUpperCase() : "",
    memory.title,
    memory.problemDescription,
    memory.userApproach,
    (memory.errors ?? []).join("; "),
    memory.lessonLearned,
  ].filter(Boolean);

  const codeText = (memory.code ?? [])
    .map((block) => `${block.language}: ${block.code}`)
    .join("\n\n");

  return chunkText([...parts, codeText].join("\n\n"));
}
