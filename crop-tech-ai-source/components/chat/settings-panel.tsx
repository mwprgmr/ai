"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language, Theme } from "./types";

type Props = {
  open: boolean;
  language: Language;
  theme: Theme;
  model: string;
  onClose: () => void;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: Theme) => void;
  onModelChange: (model: string) => void;
  onClearHistory: () => void;
};

export function SettingsPanel(props: Props) {
  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 p-4 backdrop-blur-sm">
      <aside className="ms-auto flex h-full w-full max-w-md flex-col rounded-lg border border-[var(--border)] bg-[var(--panel)] shadow-xl">
        <header className="flex items-center justify-between border-b border-[var(--border)] p-4">
          <div>
            <h2 className="text-lg font-semibold">Settings</h2>
            <p className="text-sm text-[var(--muted)]">Crop Tech AI preferences</p>
          </div>
          <Button size="icon" variant="ghost" onClick={props.onClose} aria-label="Close settings">
            <X className="h-4 w-4" />
          </Button>
        </header>
        <div className="space-y-6 overflow-y-auto p-4">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">General</h3>
            <label className="block text-sm">
              Language
              <select className="mt-1 w-full rounded-md border border-[var(--border)] bg-transparent p-2" value={props.language} onChange={(event) => props.onLanguageChange(event.target.value as Language)}>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </label>
            <label className="block text-sm">
              Theme
              <select className="mt-1 w-full rounded-md border border-[var(--border)] bg-transparent p-2" value={props.theme} onChange={(event) => props.onThemeChange(event.target.value as Theme)}>
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label className="block text-sm">
              Response style
              <select className="mt-1 w-full rounded-md border border-[var(--border)] bg-transparent p-2" defaultValue="balanced">
                <option value="balanced">Balanced</option>
                <option value="concise">Concise</option>
                <option value="detailed">Detailed</option>
              </select>
            </label>
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">AI</h3>
            <label className="block text-sm">
              Model
              <input className="mt-1 w-full rounded-md border border-[var(--border)] bg-transparent p-2" value={props.model} onChange={(event) => props.onModelChange(event.target.value)} />
            </label>
            <label className="block text-sm">
              Response length
              <select className="mt-1 w-full rounded-md border border-[var(--border)] bg-transparent p-2" defaultValue="auto">
                <option value="auto">Auto</option>
                <option value="short">Short</option>
                <option value="long">Long</option>
              </select>
            </label>
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Privacy</h3>
            <p className="text-sm text-[var(--muted)]">Chat history is stored in this browser using localStorage for the demo.</p>
            <Button variant="danger" type="button" onClick={props.onClearHistory}>Clear chat history</Button>
          </section>
          <section className="space-y-1">
            <h3 className="text-sm font-semibold">About</h3>
            <p className="text-sm">Crop Tech AI</p>
            <p className="text-sm text-[var(--muted)]">Powered by Crop Tech Solutions</p>
          </section>
        </div>
      </aside>
    </div>
  );
}
