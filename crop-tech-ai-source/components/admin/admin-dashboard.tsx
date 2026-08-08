"use client";

import { ArrowLeft, BarChart3, Bot, Languages, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const cards = [
  { label: "Total Users", value: "1,248", icon: Users },
  { label: "Conversations", value: "18,420", icon: MessageSquare },
  { label: "Messages Today", value: "3,842", icon: Bot },
  { label: "AI Usage", value: "72%", icon: BarChart3 }
];

const conversations = [42, 58, 63, 80, 76, 96, 118, 132, 125, 149, 168, 182];
const models = [
  ["Claude Sonnet", 46],
  ["GPT", 31],
  ["Gemini", 15],
  ["Other", 8]
];

export function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[var(--background)] p-4 text-[var(--foreground)] md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--muted)]">Crop Tech AI</p>
            <h1 className="text-3xl font-semibold">Admin demo</h1>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--panel)] px-3.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
            href="/"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to chat
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent)] text-white">
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-[var(--muted)]">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm">
            <h2 className="font-semibold">Conversations over time</h2>
            <div className="mt-6 flex h-72 items-end gap-3">
              {conversations.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-md bg-[var(--accent)]" style={{ height: `${(value / 190) * 100}%` }} />
                  <span className="text-xs text-[var(--muted)]">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm">
              <h2 className="font-semibold">AI usage</h2>
              <div className="mt-5 h-4 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div className="h-full w-[72%] bg-[var(--accent)]" />
              </div>
              <p className="mt-3 text-sm text-[var(--muted)]">72% of the monthly demo quota used.</p>
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Languages className="h-4 w-4 text-[var(--accent)]" />
                <h2 className="font-semibold">Language distribution</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border border-[var(--border)] p-3">
                  <p className="text-[var(--muted)]">English</p>
                  <p className="text-xl font-semibold">68%</p>
                </div>
                <div className="rounded-md border border-[var(--border)] p-3">
                  <p className="text-[var(--muted)]">Arabic</p>
                  <p className="text-xl font-semibold">32%</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm">
              <h2 className="font-semibold">Popular models</h2>
              <div className="mt-4 space-y-3">
                {models.map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{label}</span>
                      <span className="text-[var(--muted)]">{value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div className="h-full bg-[var(--accent)]" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
