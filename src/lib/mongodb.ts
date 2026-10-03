import { MongoClient, type Collection, type Db, type MongoClientOptions } from "mongodb";
import { env } from "./env";
import type {
  CodingMemory,
  PracticeRecommendation,
  VectorMemory,
} from "@/types";

/**
 * Collections are keyed by application-generated string ids, not ObjectId, so we
 * type the document shapes with `_id: string`. This lets queries such as
 * `find({ _id: id })` and `find({ _id: { $in: ids } })` typecheck.
 */
export type UserDocument = {
  _id: string;
  email: string;
  name?: string;
  createdAt: Date;
  [key: string]: unknown;
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function createOptions(): Partial<MongoClientOptions> {
  const options: Partial<MongoClientOptions> = {
    serverSelectionTimeoutMS: 5_000,
    heartbeatFrequencyMS: 5_000,
  };

  if (env.NODE_ENV === "test") {
    options.retryWrites = false;
    options.writeConcern = { w: "majority" };
  }

  return options;
}

export function getCollection<T extends { _id: string }>(
  db: Db,
  name: string,
): Collection<T> {
  return db.collection<T>(name);
}

/**
 * Turn a driver failure into a message a developer can act on.
 *
 * Route handlers used to swallow the underlying cause and return a flat
 * "Failed to create memory", which hides the fact that the database was
 * unreachable behind a message that reads like an application bug.
 */
export function describeDatabaseError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("MONGODB_URI is not defined")) {
    return "MONGODB_URI is not defined. Set it in .env.local.";
  }

  if (/alert internal error|alert number 80|tlsv1 alert/i.test(message)) {
    return (
      "Could not reach MongoDB: the server rejected the TLS handshake. " +
      "This usually means your public IP address is missing from the Atlas IP Access List " +
      "(Network Access -> Add Entry, e.g. 0.0.0.0/0 for local development)."
    );
  }

  if (/Server selection timed out|ETIMEDOUT|ENOTFOUND|getaddrinfo/i.test(message)) {
    return (
      "Could not reach MongoDB: connection timed out. " +
      "Check MONGODB_URI, your network/proxy, and the Atlas IP Access List."
    );
  }

  if (/Authentication failed|auth.*failed|bad auth|SCRAM/i.test(message)) {
    return "MongoDB authentication failed. Check the username and password in MONGODB_URI.";
  }

  return "Failed to connect to MongoDB. See the server logs for details.";
}

export function connectToMongoDB(): Promise<MongoClient> {
  if (env.NODE_ENV === "test") {
    return Promise.reject(
      new Error(
        "MongoDB connection is not available in unit tests. Use the in-memory server helpers instead.",
      ),
    );
  }

  if (clientPromise) {
    return clientPromise;
  }

  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined. Set it in .env.local.");
  }

  client = new MongoClient(env.MONGODB_URI, createOptions());
  clientPromise = client.connect();
  return clientPromise;
}

export async function disconnectFromMongoDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    clientPromise = null;
  }
}

export function getDatabase(client: MongoClient, name?: string): Db {
  return client.db(name || env.MONGODB_DB_NAME);
}

export function getUsersCollection(client: MongoClient): Collection<UserDocument> {
  return getCollection<UserDocument>(getDatabase(client), "users");
}

export function getMemoriesCollection(client: MongoClient): Collection<CodingMemory> {
  return getCollection<CodingMemory>(getDatabase(client), "coding_memories");
}

export function getVectorMemoriesCollection(client: MongoClient): Collection<VectorMemory> {
  return getCollection<VectorMemory>(getDatabase(client), "vector_memories");
}

export function getPracticeRecommendationsCollection(
  client: MongoClient,
): Collection<PracticeRecommendation> {
  return getCollection<PracticeRecommendation>(
    getDatabase(client),
    "practice_recommendations",
  );
}

export { createVectorSearchIndex } from "./vectorSearch";