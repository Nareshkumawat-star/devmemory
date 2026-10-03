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
  return {
    url: env.EMBEDDING_API_URL ?? "https://api.openai.com/v1",
    key: env.EMBEDDING_API_KEY ?? "",
    model: env.EMBEDDING_MODEL ?? "text-embedding-3-small",
  };
}

export interface GemmaConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export function getGemmaConfig(): GemmaConfig {
  return {
    baseUrl: env.GEMMA_API_URL ?? "http://localhost:11434/v1",
    apiKey: env.GEMMA_API_KEY ?? "local",
    model: env.GEMMA_MODEL ?? "gemma2:9b",
  };
}
