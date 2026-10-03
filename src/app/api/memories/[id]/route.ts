import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { getMemoriesCollection } from "@/lib/mongodb";

function getUserId(request: NextRequest): string {
  const token = request.cookies.get("next-auth.session-token")?.value || "anonymous";
  return `user-${token.slice(0, 8)}`;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await connectToMongoDB();
    const memories = getMemoriesCollection(client);
    const userId = getUserId(req);

    const memory = await memories.findOne({ _id: id, userId });
    if (!memory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json(memory);
  } catch (error) {
    console.error("Failed to fetch memory:", error);
    return NextResponse.json({ error: "Failed to fetch memory" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const client = await connectToMongoDB();
    const memories = getMemoriesCollection(client);
    const userId = getUserId(req);

    const result = await memories.updateOne({ _id: id, userId }, { $set: body });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    const updated = await memories.findOne({ _id: id, userId });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update memory:", error);
    return NextResponse.json({ error: "Failed to update memory" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await connectToMongoDB();
    const memories = getMemoriesCollection(client);
    const userId = getUserId(req);

    const result = await memories.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete memory:", error);
    return NextResponse.json({ error: "Failed to delete memory" }, { status: 500 });
  }
}
