"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Brain, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi there! I'm your coding mentor powered by your personal coding memories. Ask me anything about your past mistakes, approaches, or coding concepts.",
};

export function AskPanel() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, memoryIds: [] }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(error?.error || "Failed to get answer");
      }

      const data = (await response.json()) as { answer?: string };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer ?? "I don't have an answer yet." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your question. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Coding Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about your coding journey. Your stored memories are used
            for personalized answers.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ask-question">Your question</Label>
              <Textarea
                id="ask-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Why did I keep getting this binary search error?"
                rows={4}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Thinking..." : "Ask"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <Card
              className={`max-w-[80%] ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <CardContent className="p-4">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}