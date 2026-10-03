import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB, describeDatabaseError } from "@/lib/mongodb";
import { getMemoriesCollection } from "@/lib/mongodb";
import { createMemorySchema } from "@/lib/validations";
import type { CodingMemory } from "@/types";

function getUserId(request: NextRequest): string {
  const token = request.cookies.get("next-auth.session-token")?.value || "anonymous";
  return `user-${token.slice(0, 8)}`;
}

export async function GET(request: NextRequest) {
  try {
    const memories = getMemoriesCollection(await connectToMongoDB());
    const { searchParams } = new URL(request.url);
    const userId = getUserId(request);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50");

    const filter: Record<string, unknown> = { userId };
    if (type) filter.type = type;

    const result = await memories.find(filter).sort({ createdAt: -1 }).limit(limit).toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch memories:", error);
    return NextResponse.json({ error: describeDatabaseError(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createMemorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.issues }, { status: 400 });
    }

    const memories = getMemoriesCollection(await connectToMongoDB());

    const now = new Date();
    const memory: CodingMemory = {
      _id: crypto.randomUUID(),
      // Server-side identity only: every read (GET/PUT/DELETE) filters by
      // getUserId(), so trusting the body here would store rows no query can find.
      userId: getUserId(request),
      type: parsed.data.type,
      title: parsed.data.title,
      problemDescription: parsed.data.problemDescription,
      userApproach: parsed.data.userApproach,
      code: parsed.data.code,
      errors: parsed.data.errors,
      lessonLearned: parsed.data.lessonLearned,
      tags: parsed.data.tags,
      difficulty: parsed.data.difficulty ?? "beginner",
      createdAt: now,
      updatedAt: now,
    };

    await memories.insertOne(memory);
    return NextResponse.json(memory, { status: 201 });
  } catch (error) {
    console.error("Failed to create memory:", error);
    return NextResponse.json({ error: describeDatabaseError(error) }, { status: 500 });
  }
}
