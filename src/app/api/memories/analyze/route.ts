import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { getMemoriesCollection } from "@/lib/mongodb";
import { analyzeMemorySchema } from "@/lib/validations";
import { analyzeCodingMemory } from "@/lib/ai/gemma";
import { upsertMemoryToVectorSearch } from "@/lib/rag/pipeline";
import { embedText, chunkMemoryToTexts } from "@/lib/embeddings/embed";

function getUserId(request: NextRequest): string {
  const token = request.cookies.get("next-auth.session-token")?.value || "anonymous";
  return `user-${token.slice(0, 8)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = analyzeMemorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.issues }, { status: 400 });
    }

    const { errors, code, problemDescription, memoryId } = parsed.data;
    const userId = getUserId(request);

    const client = await connectToMongoDB();
    const memories = getMemoriesCollection(client);

    const analysis = await analyzeCodingMemory({
      code: code.map((b: { code: string }) => b.code).join("\n"),
      errors,
      problemDescription,
    });

    const memory = await memories.findOne({ _id: memoryId, userId });
    if (memory) {
      await memories.updateOne(
        { _id: memoryId, userId },
        { $set: { ...analysis, updatedAt: new Date() } },
      );
    }

    const chunkTexts = chunkMemoryToTexts({
      type: memory?.type || "error",
      title: memory?.title || "unknown",
      problemDescription: memory?.problemDescription || problemDescription,
      userApproach: memory?.userApproach || "",
      errors: memory?.errors ?? errors,
      lessonLearned: analysis.learnings.join(" "),
      code,
    });

    if (chunkTexts.length > 0) {
      const embeddings = await embedText({ texts: chunkTexts });

      for (const [index, text] of chunkTexts.entries()) {
        const embedding = embeddings[index];
        if (embedding) {
          await upsertMemoryToVectorSearch(client, userId, memoryId, text, embedding, index);
        }
      }
    }

    return NextResponse.json({
      analysis,
      sources: [],
    });
  } catch (error) {
    console.error("Failed to analyze memory:", error);
    return NextResponse.json({ error: "Failed to analyze memory" }, { status: 500 });
  }
}
