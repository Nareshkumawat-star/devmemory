import type { Document } from "mongodb";

export type Language = "cpp" | "python" | "javascript" | "java" | "typescript";

export type MemoryType = "error" | "lesson" | "approach" | "probability";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type CodeBlock = {
  language: Language;
  code: string;
};

export type CodingMemory = {
  _id: string;
  userId: string;
  type: MemoryType;
  title: string;
  problemDescription: string;
  userApproach: string;
  code: CodeBlock[];
  errors: string[];
  lessonLearned: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  difficulty: Difficulty;
};

export type MemoryDoc = CodingMemory & Document;

export type VectorMemory = {
  _id: string;
  userId: string;
  embedding: number[];
  text: string;
};

export type VectorMemoryDoc = VectorMemory & Document;

export type PracticeRecommendation = {
  _id: string;
  userId: string;
  difficulty: Difficulty;
  topics: string[];
  problem: string;
  approachHint: string;
  constraints: string;
  tests: string[];
  rationale: string;
  createdAt: Date;
};

export type PracticeRecommendationDoc = PracticeRecommendation & Document;

export type MistakeInsight = {
  type:
    | "syntax"
    | "runtime"
    | "logic"
    | "type"
    | "api-misuse"
    | "optimization";
  frequency: number;
  topics: string[];
};

export type Analytics = {
  totalMistakes: number;
  mistakesByType: Record<string, number>;
  mistakesByTopic: Record<string, number>;
  problemsSolved: number;
  mistakeTrend: number[];
  improvementTimeline: number[];
};

export type AIAnswer = {
  answer: string;
  sources: Array<{ memoryId: string; snippet: string; relevance: number }>;
  analysis: string;
};

export type EmbedRequest = {
  model: string;
  input: string | string[];
};

export type EmbedResponse = {
  data: Array<{ embedding: number[] }>;
  model: string;
};

export type EmbedModel = "text-embedding-3-small" | "text-embedding-3-large" | "e5-mistral";

export interface EmbeddingConfig {
  url: string;
  key: string;
  model: string;
}

export interface GemmaConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface MemoryAnalysis {
  rootCauses: string[];
  mistakeCategories: string[];
  severity: "low" | "medium" | "high";
  suggestedFix: string;
  learnings: string[];
}
