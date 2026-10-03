import { NextRequest, NextResponse } from "next/server";
import {
  connectToMongoDB,
  describeDatabaseError,
  getMemoriesCollection,
} from "@/lib/mongodb";
import { practiceSchema } from "@/lib/validations";
import { generatePractice } from "@/lib/ai/practice";

function getUserId(request: NextRequest): string {
  const token = request.cookies.get("next-auth.session-token")?.value || "anonymous";
  return `user-${token.slice(0, 8)}`;
}

/**
 * Gemma runs locally (Ollama on :11434 by default), so its failures are
 * almost always "the server isn't running" rather than application bugs.
 */
function describeAIError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (/fetch failed|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|network/i.test(message)) {
    return (
      "Could not reach the AI model. Start your local server (e.g. `ollama serve`) " +
      "or check GEMMA_API_URL in .env.local."
    );
  }

  if (message.includes("GEMMA_API_URL is not configured")) {
    return "GEMMA_API_URL is not configured. Set it in .env.local.";
  }

  if (message.includes("Gemma API error")) {
    return `The AI model returned an error: ${message.slice(0, 300)}`;
  }

  if (message.includes("invalid JSON") || message.includes("empty practice")) {
    return "The AI model returned an unreadable response. Try generating again.";
  }

  return "Failed to generate a practice problem.";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = practiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const userId = getUserId(request);
    const { difficulty, topics = [], excludeMemoryIds = [] } = parsed.data;

    const client = await connectToMongoDB();
    const memories = getMemoriesCollection(client);

    // Ground the prompt in what this user actually got wrong, so the problem
    // targets their weak spots instead of a generic kata.
    const history = await memories
      .find({ userId, _id: { $nin: excludeMemoryIds } })
      .sort({ createdAt: -1 })
      .limit(25)
      .toArray();

    const context = history.length
      ? [
          `The learner has ${history.length} saved coding memories. Recent titles and lessons:`,
          ...history.map(
            (memory) =>
              `- [${memory.type}/${memory.difficulty}] ${memory.title}` +
              (memory.lessonLearned ? ` — ${memory.lessonLearned.slice(0, 200)}` : ""),
          ),
        ].join("\n")
      : "The learner has no saved memories yet. Generate a well-rounded introductory problem.";

    const derivedTopics =
      topics.length > 0
        ? topics
        : [...new Set(history.flatMap((memory) => memory.tags))].slice(0, 10);

    const result = await generatePractice({
      difficulty,
      topics: derivedTopics,
      excludeMemoryIds,
      context,
    });

    return NextResponse.json({ ...result, sourceCount: history.length });
  } catch (error) {
    console.error("Failed to generate practice problem:", error);

    const isDatabaseError =
      error instanceof Error && /Mongo|MONGODB|timed out|TLS|auth|Server selection/i.test(error.message);

    return NextResponse.json(
      { error: isDatabaseError ? describeDatabaseError(error) : describeAIError(error) },
      { status: 502 },
    );
  }
}
