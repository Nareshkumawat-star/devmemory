import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { getMemoriesCollection } from "@/lib/mongodb";
import { askAIContextSchema } from "@/lib/validations";
import { askQuestion, toAskMemoryContexts } from "@/lib/ai/ask";

function getUserId(request: NextRequest): string {
  const token = request.cookies.get("next-auth.session-token")?.value || "anonymous";
  return `user-${token.slice(0, 8)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = askAIContextSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.issues }, { status: 400 });
    }

    const { question, memoryIds = [] } = parsed.data;
    const userId = getUserId(request);

    const client = await connectToMongoDB();
    const memories = getMemoriesCollection(client);

    const memoryDocs = await memories.find({ _id: { $in: memoryIds }, userId }).toArray();

    const result = await askQuestion({
      question,
      memories: toAskMemoryContexts(memoryDocs),
      userId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to ask question:", error);
    return NextResponse.json({ error: "Failed to process question" }, { status: 500 });
  }
}
