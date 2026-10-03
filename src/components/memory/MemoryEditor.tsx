"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code2 } from "lucide-react";
import Editor from "@monaco-editor/react";
import { type MemoryType, type Difficulty, type Language, type CreateMemoryInput } from "@/lib/validations/memories";

const languageOptions = [
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "typescript", label: "TypeScript" },
];

const typeOptions = [
  { value: "error", label: "Error" },
  { value: "lesson", label: "Lesson Learned" },
  { value: "approach", label: "Approach" },
  { value: "probability", label: "Probability" },
];

const difficultyOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const codeLanguages: Record<Language, string[]> = {
  cpp: ["#include <iostream>", "int main() { return 0; }"],
  python: ["def hello():", "    print('Hello, World!')"],
  javascript: ["function greet() {", "  return 'Hello';", "}"],
  java: ["public class Hello {", "  public static void main(String[] args) {}", "}"],
  typescript: ["function greet(): string {", "  return 'Hello';", "}"],
};

interface MemoryEditorProps {
  onSubmit: (data: CreateMemoryInput) => Promise<void> | void;
  defaultType?: MemoryType;
  defaultDifficulty?: Difficulty;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

export function MemoryEditor({
  onSubmit,
  defaultType = "error",
  defaultDifficulty = "intermediate",
  submitLabel = "Save Memory",
  cancelLabel = "Cancel",
  onCancel,
}: MemoryEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MemoryType>(defaultType);
  const [difficulty, setDifficulty] = useState<Difficulty>(defaultDifficulty);
  const [tags, setTags] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("python");
  const [code, setCode] = useState(codeLanguages.python.join("\n"));
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const tagsList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const data: CreateMemoryInput = {
        userId: "current-user",
        type,
        title: title.trim(),
        problemDescription: description.trim(),
        userApproach: code.trim(),
        code: [{ language: selectedLanguage, code: code.trim() }],
        errors: [],
        lessonLearned: "",
        tags: tagsList,
        difficulty,
      };

      if (!data.title) {
        setErrorMessage("Title is required.");
        return;
      }

      setSubmitting(true);
      setErrorMessage("");

      try {
        await onSubmit(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to save memory.");
      } finally {
        setSubmitting(false);
      }
    },
    [title, description, type, difficulty, tags, selectedLanguage, code, onSubmit],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-5 w-5" />
          New Coding Memory
        </CardTitle>
        <CardDescription>Save a problem, error, or lesson to grow your coding memory.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Binary search infinite loop"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Problem Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What problem are you trying to solve?"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="memory-type">Type</Label>
            <Select
              id="memory-type"
              value={type}
              onChange={(e) => setType(e.target.value as MemoryType)}
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="memory-difficulty">Difficulty</Label>
            <Select
              id="memory-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              {difficultyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="memory-language">Code</Label>
          <Select
            id="memory-language"
            value={selectedLanguage}
            onChange={(e) => {
              const next = e.target.value as Language;
              setSelectedLanguage(next);
              setCode(codeLanguages[next].join("\n"));
            }}
          >
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          <Editor
            height={260}
            language={selectedLanguage}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="array, binary-search, bug"
          />
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
