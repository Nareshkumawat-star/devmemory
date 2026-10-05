import { getGemmaConfig } from "@/lib/env";
import type { CodingMemory } from "@/types";

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

export interface AskMemoryContext {
  id: string;
  type: CodingMemory["type"];
  title: string;
  content: string;
  snippet: string;
}

export interface AskQuestionInput {
  question: string;
  memories: AskMemoryContext[];
  userId: string;
}

/** Flattens a stored memory into the compact context block sent to the model. */
export function toAskMemoryContext(memory: CodingMemory): AskMemoryContext {
  return {
    id: memory._id,
    type: memory.type,
    title: memory.title,
    content: [memory.problemDescription, memory.userApproach, memory.lessonLearned]
      .filter(Boolean)
      .join("\n\n"),
    snippet: (memory.problemDescription || memory.userApproach || memory.lessonLearned || "")
      .slice(0, 350),
  };
}

export function toAskMemoryContexts(memories: CodingMemory[]): AskMemoryContext[] {
  return memories.map(toAskMemoryContext);
}

export interface AskQuestionResponse {
  answer: string;
  analysis: string;
  sources: Array<{ memoryId: string; snippet: string; relevance: number }>;
}

const SystemPrompt = `You are an expert coding mentor with access to the user's stored coding memories. Answer the user's question using their own history first.

Rules:
- Answer in a clear, concise, direct style.
- Ground your answer in the provided memories when relevant. Cite which memory you used by its memoryId.
- If the memories do not contain enough context, say so and give a general explanation.
- Never invent code, error messages, or user history. If you do not know, say you do not know.
- Do not emit markdown fences. Emit raw text.`;

export async function askQuestion({ question, memories, userId }: AskQuestionInput): Promise<AskQuestionResponse> {
  const config = getGemmaConfig();
  if (!config.baseUrl) {
    throw new Error("GEMMA_API_URL is not configured");
  }

  const contextLines = memories.map((memory) => {
    const header = `[${memory.type} memory: ${memory.title} (id: ${memory.id})]`;
    const body = memory.content || memory.snippet || "";
    return `${header}\n${body}`;
  });

  const userPrompt = [
    "User question:",
    question,
    "",
    "Relevant coding memories:",
    contextLines.length ? contextLines.join("\n\n") : "No relevant memories found yet.",
    "",
    "You are speaking to: " + userId,
    "Use their history to personalize your answer.",
  ].join("\n");

  const messages = [
    { role: "system", content: SystemPrompt },
    { role: "user", content: userPrompt },
  ];

  const body = {
    model: config.model,
    messages,
    temperature: 0.2,
    max_tokens: 1500,
  };

  const result = await post<{ choices: Array<{ message: { content: string } }> }>("/chat/completions", body);

  if (!result.choices?.[0]?.message?.content) {
    throw new Error("Gemma returned an empty answer.");
  }

  const rawAnswer = result.choices[0].message.content;

  return {
    answer: rawAnswer,
    analysis: "Answer generated from the user's coding memories via RAG.",
    sources: memories
      .filter((memory) => memory.id && memory.snippet)
      .map((memory) => ({ memoryId: memory.id, snippet: memory.snippet.slice(0, 200), relevance: 1 })),
  };
}
