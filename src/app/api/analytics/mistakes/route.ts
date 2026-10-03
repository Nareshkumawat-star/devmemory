import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB, describeDatabaseError } from "@/lib/mongodb";
import { getMemoriesCollection } from "@/lib/mongodb";
import { mistakeFrequency, severityDistribution, topicWeakness, problemsSolvedCount, mistakeTrend, improvementTimeline, difficultyDistribution } from "@/lib/ai/analytics";
import { analyticsSchema } from "@/lib/validations";

function getUserId(request: NextRequest): string {
  const token = request.cookies.get("next-auth.session-token")?.value || "anonymous";
  return `user-${token.slice(0, 8)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = getUserId(request);
    const range = searchParams.get("range") || "7d";

    const parsed = analyticsSchema.safeParse({ userId, range });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { range: validatedRange = "7d" } = parsed.data;

    const client = await connectToMongoDB();
    const memories = getMemoriesCollection(client);

    const memoriesList = await memories.find({ userId }).toArray();

    const analytics = {
      totalMistakes: memoriesList.length,
      mistakesByType: mistakeFrequency(memoriesList),
      mistakesByTopic: topicWeakness(memoriesList),
      problemsSolved: problemsSolvedCount(memoriesList),
      mistakeTrend: mistakeTrend(memoriesList, validatedRange),
      improvementTimeline: improvementTimeline(memoriesList, validatedRange),
      severity: severityDistribution(memoriesList),
      difficulty: {
        beginner: difficultyDistribution(memoriesList, "beginner"),
        intermediate: difficultyDistribution(memoriesList, "intermediate"),
        advanced: difficultyDistribution(memoriesList, "advanced"),
      },
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: describeDatabaseError(error) }, { status: 500 });
  }
}
