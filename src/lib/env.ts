import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1).optional(),
  MONGODB_DB_NAME: z.string().min(1).optional(),

  AUTH_SECRET: z.string().min(1).optional(),
  AUTH_URL: z.string().url().optional(),

  GEMMA_API_URL: z.string().url().optional(),
  GEMMA_API_KEY: z.string().min(1).optional(),

  EMBEDDING_API_URL: z.string().url().optional(),
  EMBEDDING_API_KEY: z.string().min(1).optional(),

  EMBEDDING_MODEL: z.string().min(1).optional(),
  GEMMA_MODEL: z.string().min(1).optional(),

  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

export const env = envSchema.parse(process.env);

export interface EmbeddingConfig {
  url: string;
  key: string;
  model: string;
}

export function getEmbeddingConfig(): EmbeddingConfig {
  const rawUrl = process.env.EMBEDDING_API_URL || env.EMBEDDING_API_URL || "https://api.openai.com/v1";
  const rawKey = process.env.EMBEDDING_API_KEY || env.EMBEDDING_API_KEY || "";
  const rawModel = process.env.EMBEDDING_MODEL || env.EMBEDDING_MODEL || "text-embedding-3-small";

  return {
    url: rawUrl.trim().replace(/[\r\n]+/g, ""),
    key: rawKey.trim().replace(/[\r\n]+/g, ""),
    model: rawModel.trim().replace(/[\r\n]+/g, ""),
  };
}

export interface GemmaConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export function getGemmaConfig(): GemmaConfig {
  const rawUrl = process.env.GEMMA_API_URL || env.GEMMA_API_URL || "http://localhost:11434/v1";
  const rawKey = process.env.GEMMA_API_KEY || env.GEMMA_API_KEY || "local";
  const rawModel = process.env.GEMMA_MODEL || env.GEMMA_MODEL || "gemma2:9b";

  return {
    baseUrl: rawUrl.trim().replace(/[\r\n]+/g, "").replace(/\/+$/, ""),
    apiKey: rawKey.trim().replace(/[\r\n]+/g, ""),
    model: rawModel.trim().replace(/[\r\n]+/g, ""),
  };
}
