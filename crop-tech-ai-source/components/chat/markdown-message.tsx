"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="prose-chat max-w-none text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            const text = String(children).replace(/\n$/, "");
            return (
              <div className="my-3 overflow-hidden rounded-md border border-[var(--border)]">
                <div className="flex items-center justify-between border-b border-[var(--border)] bg-black/5 px-3 py-1.5 text-xs text-[var(--muted)] dark:bg-white/10">
                  <span>Code</span>
                  <Button size="sm" variant="ghost" type="button" onClick={() => navigator.clipboard.writeText(text)}>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </Button>
                </div>
                <pre className="m-0 rounded-none border-0">{children}</pre>
              </div>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
