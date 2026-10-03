import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { searchMemoriesSchema } from "@/lib/validations";
import { searchMemoriesByVector } from "@/lib/rag/pipeline";

function getUserId(request: NextRequest): string {
  const token = request.cookies.get("next-auth.session-token")?.value || "anonymous";
  return `user-${token.slice(0, 8)}`;
}

export async function GET(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = searchMemoriesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.issues }, { status: 400 });
    }

    const { query, limit = 5 } = parsed.data;
    const userId = getUserId(request);

    const client = await connectToMongoDB();
    const results = await searchMemoriesByVector(client, userId, query, limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to search memories:", error);
    return NextResponse.json({ error: "Failed to search memories" }, { status: 500 });
  }
}
