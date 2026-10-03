import { cookies } from "next/headers";
import {
  connectToMongoDB,
  describeDatabaseError,
  getMemoriesCollection,
} from "@/lib/mongodb";
import type { CodingMemory } from "@/types";

/**
 * Mirrors the identity scheme used by every API route handler, so Server
 * Component reads match what POST /api/memories writes.
 *
 * next-auth is not wired up yet, so there is never a session token and this
 * resolves to "user-anonymou" for everyone. That is intentional: one shared
 * bucket beats split-brain ids where writes land under a different key than
 * reads.
 */
export function userIdFromToken(token?: string | null): string {
  return `user-${(token || "anonymous").slice(0, 8)}`;
}

async function currentUserId(): Promise<string> {
  const store = await cookies();
  return userIdFromToken(store.get("next-auth.session-token")?.value);
}

export type MemoriesResult = {
  memories: CodingMemory[];
  /** Human-readable cause when the database could not be reached. */
  error: string | null;
};

/**
 * Load the current user's memories, newest first.
 *
 * Never throws: pages need to render an empty state rather than a stack trace
 * when Atlas is unreachable.
 */
export async function loadMemories(limit = 50): Promise<MemoriesResult> {
  try {
    const userId = await currentUserId();
    const client = await connectToMongoDB();
    const memories = getMemoriesCollection(client);
    const rows = await memories
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return { memories: rows, error: null };
  } catch (error) {
    console.error("Failed to load memories:", error);
    return { memories: [], error: describeDatabaseError(error) };
  }
}

/** Load a single memory scoped to the current user, or null when absent. */
export async function loadMemory(
  id: string,
): Promise<{ memory: CodingMemory | null; error: string | null }> {
  try {
    const userId = await currentUserId();
    const client = await connectToMongoDB();
    const memory = await getMemoriesCollection(client).findOne({
      _id: id,
      userId,
    });

    return { memory, error: null };
  } catch (error) {
    console.error("Failed to load memory:", error);
    return { memory: null, error: describeDatabaseError(error) };
  }
}
