import { z } from "zod";

export const languageEnum = z.enum(["cpp", "python", "javascript", "java", "typescript"]);

export const memoryTypeEnum = z.enum(["error", "lesson", "approach", "probability"]);

export const difficultyEnum = z.enum(["beginner", "intermediate", "advanced"]);

export const codeBlockSchema = z.object({
  language: languageEnum,
  code: z.string().min(1),
});

export const createMemorySchema = z.object({
  userId: z.string().min(1),
  type: memoryTypeEnum,
  title: z.string().min(1, "Title is required").max(200),
  problemDescription: z.string().max(5000),
  userApproach: z.string().max(5000),
  code: z.array(codeBlockSchema).min(1),
  errors: z.array(z.string()).max(200),
  lessonLearned: z.string().max(5000),
  tags: z.array(z.string()).max(50),
  difficulty: difficultyEnum.optional(),
});

export const createVectorMemorySchema = z.object({
  userId: z.string().min(1),
  embedding: z.array(z.number()),
  text: z.string().min(1),
});

export const analyzeMemorySchema = z.object({
  userId: z.string().min(1),
  memoryId: z.string().min(1),
  errors: z.array(z.string()),
  code: z.array(codeBlockSchema).min(1),
  problemDescription: z.string(),
});

export const searchMemoriesSchema = z.object({
  userId: z.string().min(1),
  query: z.string().min(1).max(2000),
  limit: z.number().int().min(1).max(50).optional(),
});

export const askAIContextSchema = z.object({
  userId: z.string().min(1),
  question: z.string().min(1).max(4000),
  memoryIds: z.array(z.string()).max(50).optional(),
});

export const askAIContextWithMemorySchema = askAIContextSchema.extend({
  memoryId: z.string().min(1),
});

export const practiceSchema = z.object({
  userId: z.string().min(1),
  difficulty: difficultyEnum.optional(),
  topics: z.array(z.string()).max(50).optional(),
  excludeMemoryIds: z.array(z.string()).max(50).optional(),
});

export const analyticsSchema = z.object({
  userId: z.string().min(1),
  range: z.enum(["7d", "30d", "90d"]).optional(),
});

export type Language = z.infer<typeof languageEnum>;
export type MemoryType = z.infer<typeof memoryTypeEnum>;
export type Difficulty = z.infer<typeof difficultyEnum>;
export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type CreateVectorMemoryInput = z.infer<typeof createVectorMemorySchema>;
export type AnalyzeMemoryInput = z.infer<typeof analyzeMemorySchema>;
export type SearchMemoriesInput = z.infer<typeof searchMemoriesSchema>;
export type AskAIContextInput = z.infer<typeof askAIContextSchema>;
export type PracticeInput = z.infer<typeof practiceSchema>;
export type AnalyticsInput = z.infer<typeof analyticsSchema>;
