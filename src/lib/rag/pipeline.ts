import type { MongoClient } from "mongodb";
import {
  getDatabase,
  getMemoriesCollection,
  getVectorMemoriesCollection,
} from "@/lib/mongodb";
import { ensureIndexForCollection } from "@/lib/vectorSearch";
import { embedText, l2Normalize } from "@/lib/embeddings/embed";
import { askQuestion, toAskMemoryContexts } from "@/lib/ai/ask";
import type { CodingMemory } from "@/types";

export interface SearchResult {
  memory: CodingMemory;
  score: number;
  snippet: string;
}

let cachedClient: MongoClient | null = null;

export function setClient(client: MongoClient): void {
  cachedClient = client;
}

export function requireClient(): MongoClient {
  if (!cachedClient) {
    throw new Error("Mongo client not initialized. Call setClient() first.");
  }
  return cachedClient;
}

/**
 * Upserts one embedded chunk of a memory into the vector store. Chunks are
 * keyed by `memoryId` + `chunkIndex` so re-analysing a memory replaces its
 * chunks instead of accumulating duplicates.
 */
export async function upsertMemoryToVectorSearch(
  client: MongoClient,
  userId: string,
  memoryId: string,
  text: string,
  embedding: number[],
  chunkIndex = 0,
): Promise<void> {
  const vectorMemories = getVectorMemoriesCollection(client);

  await vectorMemories.updateOne(
    { userId, memoryId, chunkIndex } as never,
    {
      $set: {
        userId,
        memoryId,
        chunkIndex,
        text,
        embedding: embedding.map((value) => Number(value.toFixed(6))),
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
}

/**
 * Atlas Vector Search: embeds the query, runs `$vectorSearch` against the
 * vector store, then hydrates the matching memories from the main collection.
 */
export async function searchMemoriesByVector(
  client: MongoClient,
  userId: string,
  query: string,
  limit = 5,
): Promise<SearchResult[]> {
  const vectorMemories = getVectorMemoriesCollection(client);
  await ensureIndexForCollection(vectorMemories);

  const [rawEmbedding] = await embedText({ texts: [query] });
  if (!rawEmbedding) return [];

  const queryVector = l2Normalize(rawEmbedding);

  const records = await vectorMemories
    .aggregate<{
      memoryId: string;
      text: string;
      chunkIndex: number;
      score: number;
    }>([
      {
        $vectorSearch: {
          queryVector,
          path: "embedding",
          numCandidates: Math.max(limit * 20, 100),
          limit: limit * 5,
          filter: { userId },
        },
      },
      {
        $project: {
          userId: 0,
          _id: 0,
          embedding: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    ])
    .toArray();

  if (records.length === 0) return [];

  // Keep only the best chunk per memory so a single memory cannot dominate.
  const bestByMemory = new Map<string, (typeof records)[number]>();
  for (const record of records) {
    const existing = bestByMemory.get(record.memoryId);
    if (!existing || record.score > existing.score) {
      bestByMemory.set(record.memoryId, record);
    }
  }

  const ranked = [...bestByMemory.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const memories = await findMemoriesByIds(
    client,
    userId,
    ranked.map((record) => record.memoryId),
  );
  const byId = new Map(memories.map((memory) => [memory._id, memory]));

  return ranked.flatMap((record) => {
    const memory = byId.get(record.memoryId);
    if (!memory) return [];
    return [
      {
        memory,
        score: record.score,
        snippet: record.text.slice(0, 350),
      },
    ];
  });
}

export async function findMemoriesByIds(
  client: MongoClient,
  userId: string,
  ids: string[],
): Promise<CodingMemory[]> {
  if (ids.length === 0) return [];

  const memories = getMemoriesCollection(client);
  const results = await memories
    .find({ userId, _id: { $in: ids } })
    .toArray();

  return results;
}

/** Reads a memory directly by id, scoped to the owning user. */
export async function findMemoryById(
  client: MongoClient,
  userId: string,
  id: string,
): Promise<CodingMemory | null> {
  return getMemoriesCollection(client).findOne({ userId, _id: id });
}

export interface AskQuestionWithRAGResult {
  answer: string;
  sources: Array<{ memoryId: string; snippet: string; relevance: number }>;
}

export async function askQuestionWithRAG({
  question,
  memoryIds,
  userId,
}: {
  question: string;
  memoryIds: string[];
  userId: string;
}): Promise<AskQuestionWithRAGResult> {
  const memories = await findMemoriesByIds(await requireClient(), userId, memoryIds);
  const result = await askQuestion({
    question,
    memories: toAskMemoryContexts(memories),
    userId,
  });

  return {
    answer: result.answer,
    sources: result.sources.map((source) => ({
      memoryId: source.memoryId,
      snippet: source.snippet.slice(0, 350),
      relevance: source.relevance,
    })),
  };
}

export { getDatabase };