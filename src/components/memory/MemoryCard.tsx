"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { relativeTime } from "@/utils";
import { Eye, Edit, Trash2, Code2, AlertTriangle } from "lucide-react";
import type { CodingMemory } from "@/types";
import { useState } from "react";
import { MemoryViewer } from "./MemoryViewer";

interface MemoryCardProps {
  memory: CodingMemory;
  /** Optional so the card can be rendered from a Server Component page. */
  onEdit?: (memory: CodingMemory) => void;
  onDelete?: (id: string) => void;
}

export function MemoryCard({ memory, onEdit, onDelete }: MemoryCardProps) {
  const [showViewer, setShowViewer] = useState(false);

  const formatCode = (code: string) => {
    if (!code) return "No code available";
    return code.length > 200 ? code.slice(0, 200) + "..." : code;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base break-words">{memory.title}</CardTitle>
            <CardDescription className="text-xs">
              {memory.type} · {relativeTime(memory.createdAt)} · {memory.difficulty}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowViewer(true)}
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(memory)}
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(memory._id)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {memory.problemDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">{memory.problemDescription}</p>
        )}

        {memory.userApproach && (
          <div className="rounded-md bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Code2 className="h-3 w-3" />
              <span>Code ({memory.code?.[0]?.language})</span>
            </div>
            <p className="text-sm font-mono break-all">{formatCode(memory.userApproach)}</p>
          </div>
        )}

        {memory.errors && memory.errors.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
              <AlertTriangle className="h-3 w-3" />
              <span>Errors</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {memory.errors.map((error, i) => (
                <div key={i} className="truncate">{error}</div>
              ))}
            </div>
          </div>
        )}

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {memory.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Updated {relativeTime(memory.updatedAt)}
        </div>
      </CardFooter>

      {showViewer && (
        <MemoryViewer
          memory={memory}
          onClose={() => setShowViewer(false)}
        />
      )}
    </Card>
  );
}
