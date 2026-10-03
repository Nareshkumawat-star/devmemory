import { MongoClient, type Collection, type Document } from "mongodb";
import { env } from "./env";
import type { VectorMemory } from "@/types";

export const VECTOR_DIMS = 1536;

export const VECTOR_INDEX_NAME = "vector_index";

type VectorIndexSpec = {
  name: string;
  vector: { type: "vector"; dims: number; similarity: "cosine" | "dotProduct" | "euclidean" };
};

const VECTOR_INDEX_SPEC: VectorIndexSpec = {
  name: VECTOR_INDEX_NAME,
  vector: {
    type: "vector",
    dims: VECTOR_DIMS,
    similarity: "cosine",
  },
};

function isVectorIndex(index: { key?: Document }): boolean {
  if (!index.key || typeof index.key !== "object") return false;

  const keys = Object.keys(index.key);
  if (keys.length !== 1 || keys[0] !== "embedding") return false;

  const def = index.key.embedding as
    | { type?: string; dims?: number; similarity?: string }
    | undefined;

  return def?.type === "vector" && typeof def.dims === "number" && def.similarity === "cosine";
}

/**
 * Atlas Vector Search indexes must be created at the database level, so this
 * creates the index on `db` targeting the given collection name.
 */
export async function createVectorSearchIndex(
  db: import("mongodb").Db,
  collectionName = "vector_memories",
): Promise<void> {
  const indexes = await db.collection(collectionName).indexes();

  if (indexes.some(isVectorIndex)) {
    return;
  }

  await db.createIndex(
    collectionName,
    { embedding: "vector" } as Document,
    VECTOR_INDEX_SPEC as unknown as Document,
  );
}

/** Convenience wrapper that ensures the index exists on the configured database. */
export async function ensureVectorSearchIndex(client: MongoClient): Promise<void> {
  await createVectorSearchIndex(client.db(env.MONGODB_DB_NAME));
}

/**
 * Small helper used by the RAG pipeline: makes sure the collection backing a
 * given vector store has an Atlas Vector Search index before we query it.
 */
export async function ensureIndexForCollection(
  collection: Collection<VectorMemory>,
): Promise<void> {
  await createVectorSearchIndex(collection.db, collection.collectionName);
}