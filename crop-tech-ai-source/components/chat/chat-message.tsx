"use client";

import type { UIMessage } from "ai";
import { Copy, RotateCcw, ThumbsDown, ThumbsUp, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarkdownMessage } from "./markdown-message";

function toolLabel(type: string, state?: string) {
  const name = type.replace(/^tool-/, "");
  const labels: Record<string, string> = {
    webSearch: "Searching the web",
    weather: "Checking current weather",
    calculator: "Calculating",
    currencyConverter: "Checking exchange rates",
    currentTime: "Checking local time",
    documentAnalysis: "Reading document",
    imageAnalysis: "Analyzing image"
  };
  const base = labels[name] || "Using a tool";
  return state === "output-available" ? base.replace(/ing$/, "ed") : `${base}...`;
}

export function ChatMessage({ message, onRegenerate }: { message: UIMessage; onRegenerate: () => void }) {
  const isUser = message.role === "user";
  const text = message.parts
    ?.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <article
        className={cn(
          "max-w-[min(760px,92%)] rounded-lg border px-4 py-3 shadow-sm",
          isUser
            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
            : "border-[var(--border)] bg-[var(--panel)] text-[var(--foreground)]"
        )}
      >
        {message.parts?.map((part, index) => {
          if (part.type === "text") {
            return isUser ? (
              <p key={index} className="whitespace-pre-wrap text-sm leading-6">
                {part.text}
              </p>
            ) : (
              <MarkdownMessage key={index} content={part.text} />
            );
          }

          if (part.type.startsWith("tool-")) {
            const state = "state" in part ? String(part.state) : undefined;
            return (
              <div key={index} className="mt-2 inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)]">
                <Wrench className="h-3.5 w-3.5" />
                {toolLabel(part.type, state)}
              </div>
            );
          }

          return null;
        })}

        {!isUser && text && (
          <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-[var(--border)] pt-2">
            <Button size="sm" variant="ghost" type="button" onClick={() => navigator.clipboard.writeText(text)}>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
            <Button size="sm" variant="ghost" type="button" onClick={onRegenerate}>
              <RotateCcw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
            <Button size="icon" variant="ghost" type="button" aria-label="Like response">
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" type="button" aria-label="Dislike response">
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </article>
    </div>
  );
}
