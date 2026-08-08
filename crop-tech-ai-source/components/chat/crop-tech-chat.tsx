"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Menu,
  Mic,
  Moon,
  MoreVertical,
  PanelLeftClose,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  User,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalConversations } from "@/lib/hooks/use-local-conversations";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./chat-message";
import { SettingsPanel } from "./settings-panel";
import type { ComposerFile, Language, Theme } from "./types";

const copy = {
  en: {
    newChat: "New Chat",
    search: "Search conversations",
    settings: "Settings",
    help: "Help",
    profile: "Demo user",
    welcome: "How can I help you today?",
    subtitle: "Ask questions, research the web, analyze documents and images, or simply have a conversation.",
    input: "Ask Crop Tech AI anything...",
    title: "Conversation",
    model: "Model",
    language: "Language",
    powered: "Powered by Crop Tech Solutions",
    retry: "Retry",
    error: "Unable to connect to the AI service. Please try again.",
    suggestions: ["Research the latest AI trends", "Create a business plan", "Analyze a document", "Translate something to Arabic"]
  },
  ar: {
    newChat: "محادثة جديدة",
    search: "ابحث في المحادثات",
    settings: "الإعدادات",
    help: "مساعدة",
    profile: "مستخدم تجريبي",
    welcome: "كيف يمكنني مساعدتك اليوم؟",
    subtitle: "اسأل، ابحث في الويب، حلل مستندات وصورا، أو تحدث بشكل طبيعي.",
    input: "اسأل Crop Tech AI أي شيء...",
    title: "المحادثة",
    model: "النموذج",
    language: "اللغة",
    powered: "مدعوم من Crop Tech Solutions",
    retry: "إعادة المحاولة",
    error: "تعذر الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",
    suggestions: ["ابحث عن أحدث اتجاهات الذكاء الاصطناعي", "أنشئ خطة عمل", "حلل مستندا", "ترجم شيئا إلى العربية"]
  }
};

const defaultModel = "anthropic/claude-sonnet-4.6";

function fileToData(file: File): Promise<ComposerFile> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      if (file.type === "text/plain") {
        resolve({ name: file.name, type: file.type, size: file.size, text: value, status: "Ready for analysis" });
        return;
      }
      resolve({ name: file.name, type: file.type, size: file.size, dataUrl: value, status: file.type.startsWith("image/") ? "Ready for vision analysis" : "Uploaded. Server extraction required." });
    };
    if (file.type === "text/plain") reader.readAsText(file);
    else reader.readAsDataURL(file);
  });
}

function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function CropTechChat() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("system");
  const [model, setModel] = useState(defaultModel);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [files, setFiles] = useState<ComposerFile[]>([]);
  const [query, setQuery] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [errorDismissed, setErrorDismissed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const syncedConversationIdRef = useRef<string | null>(null);
  const t = copy[language];
  const dir = language === "ar" ? "rtl" : "ltr";

  const {
    conversations,
    activeConversation,
    activeId,
    loaded,
    setActiveId,
    newChat,
    updateMessages,
    renameChat,
    deleteChat,
    clearHistory
  } = useLocalConversations();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest({ messages }) {
          return {
            body: {
              messages,
              model,
              files
            }
          };
        }
      }),
    [model, files]
  );

  const { messages, setMessages, sendMessage, regenerate, status, error, stop } = useChat({
    id: activeId || "boot",
    messages: activeConversation?.messages || [],
    transport
  });

  useEffect(() => {
    if (!activeConversation || syncedConversationIdRef.current === activeConversation.id) return;
    syncedConversationIdRef.current = activeConversation.id;
    setMessages(activeConversation.messages);
  }, [activeConversation, setMessages]);

  useEffect(() => {
    if (loaded && activeId) updateMessages(activeId, messages as UIMessage[]);
  }, [messages, loaded, activeId, updateMessages]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  useEffect(() => {
    applyTheme(theme);
    const listener = () => applyTheme(theme);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", listener);
    return () => window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", listener);
  }, [theme]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  const filtered = conversations.filter((conversation) => conversation.title.toLowerCase().includes(query.toLowerCase()));
  const isBusy = status === "submitted" || status === "streaming";
  const visibleError = error && !errorDismissed;

  async function submit(text = input) {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    setErrorDismissed(false);
    setInput("");
    setVoiceMessage("");
    await sendMessage({ text: trimmed });
  }

  async function addFiles(selected: FileList | null) {
    if (!selected) return;
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "image/jpeg", "image/png", "image/webp"];
    const next = await Promise.all(Array.from(selected).filter((file) => allowed.includes(file.type)).map(fileToData));
    setFiles((items) => [...items, ...next]);
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceMessage("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "ar" ? "ar-AE" : "en-US";
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join("");
      setInput(transcript);
      setVoiceMessage("Listening...");
    };
    recognition.onend = () => setVoiceMessage("");
    recognition.onerror = () => setVoiceMessage("Microphone unavailable.");
    recognition.start();
  }

  const sidebar = (
    <aside className="flex h-full w-72 shrink-0 flex-col border-e border-[var(--border)] bg-[var(--panel)]">
      <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--accent)] text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">Crop Tech AI</p>
          <p className="text-xs text-[var(--muted)]">Intelligence built for your business.</p>
        </div>
      </div>
      <div className="space-y-3 p-3">
        <Button
          className="w-full justify-start"
          variant="primary"
          onClick={() => {
            setErrorDismissed(true);
            newChat();
          }}
        >
          <Plus className="h-4 w-4" />
          {t.newChat}
        </Button>
        <label className="flex h-10 items-center gap-2 rounded-md border border-[var(--border)] px-3 text-sm text-[var(--muted)]">
          <Search className="h-4 w-4" />
          <input className="min-w-0 flex-1 bg-transparent outline-none" placeholder={t.search} value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
      </div>
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3">
        {filtered.map((conversation) => (
          <div key={conversation.id} className={cn("group flex items-center gap-1 rounded-md", conversation.id === activeId && "bg-black/5 dark:bg-white/10")}>
            <button
              className="min-w-0 flex-1 truncate px-3 py-2 text-start text-sm"
              onClick={() => {
                setErrorDismissed(true);
                setActiveId(conversation.id);
                setSidebarOpen(false);
              }}
            >
              {conversation.title}
            </button>
            <Button size="icon" variant="ghost" aria-label="Rename chat" onClick={() => renameChat(conversation.id, prompt("Rename conversation", conversation.title) || conversation.title)}>
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Delete chat" onClick={() => deleteChat(conversation.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </nav>
      <div className="space-y-1 border-t border-[var(--border)] p-3">
        <Button className="w-full justify-start" variant="ghost" onClick={() => setSettingsOpen(true)}>
          <Settings className="h-4 w-4" />
          {t.settings}
        </Button>
        <Button className="w-full justify-start" variant="ghost">
          <HelpCircle className="h-4 w-4" />
          {t.help}
        </Button>
        <div className="flex items-center gap-3 px-2 py-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black/5 dark:bg-white/10">
            <User className="h-4 w-4" />
          </div>
          <span>{t.profile}</span>
        </div>
      </div>
    </aside>
  );

  return (
    <main className="h-dvh overflow-hidden bg-[var(--background)] text-[var(--foreground)]" dir={dir}>
      <div className="flex h-full">
        <div className="hidden md:block">{sidebar}</div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div className="fixed inset-0 z-40 bg-black/30 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="h-full" initial={{ x: dir === "rtl" ? 320 : -320 }} animate={{ x: 0 }} exit={{ x: dir === "rtl" ? 320 : -320 }}>
                {sidebar}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--panel)] px-3 md:px-5">
            <div className="flex min-w-0 items-center gap-2">
              <Button className="md:hidden" size="icon" variant="ghost" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
              <Button className="hidden md:inline-flex" size="icon" variant="ghost" aria-label="Collapse sidebar">
                <PanelLeftClose className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold">{activeConversation?.title || t.title}</h1>
                <p className="text-xs text-[var(--muted)]">{t.powered}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="hidden items-center gap-2 rounded-md border border-[var(--border)] px-2 py-1.5 text-xs text-[var(--muted)] sm:flex">
                {t.model}
                <input className="w-40 bg-transparent text-[var(--foreground)] outline-none" value={model} onChange={(event) => setModel(event.target.value)} />
              </label>
              <select className="h-9 rounded-md border border-[var(--border)] bg-transparent px-2 text-sm" value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={t.language}>
                <option value="en">EN</option>
                <option value="ar">ع</option>
              </select>
              <Button size="icon" variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5 md:px-8">
            {!messages.length ? (
              <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center pb-24">
                <div className="mb-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent)] text-white">
                    <Bot className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-normal md:text-4xl">{t.welcome}</h2>
                  <p className="mt-3 max-w-2xl text-[var(--muted)]">{t.subtitle}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {t.suggestions.map((suggestion) => (
                    <button key={suggestion} className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4 text-start text-sm shadow-sm transition hover:border-[var(--accent)]" onClick={() => submit(suggestion)}>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto flex max-w-4xl flex-col gap-4 pb-36">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message as UIMessage} onRegenerate={() => regenerate()} />
                ))}
                {isBusy && (
                  <div className="flex justify-start">
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--muted)]">Thinking...</div>
                  </div>
                )}
                {visibleError && (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                    <span>{t.error}</span>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => {
                          setErrorDismissed(false);
                          regenerate();
                        }}
                      >
                      {t.retry}
                      </Button>
                      <Button size="icon" variant="ghost" type="button" aria-label="Dismiss error" onClick={() => setErrorDismissed(true)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            )}
          </div>

          <div className="border-t border-[var(--border)] bg-[var(--panel)] p-3 md:p-4">
            <div className="mx-auto max-w-4xl">
              {!!files.length && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {files.map((file) => (
                    <div key={`${file.name}-${file.size}`} className="flex items-center gap-2 rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs">
                      {file.type.startsWith("image/") ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      <span className="max-w-44 truncate">{file.name}</span>
                      <span className="text-[var(--muted)]">{file.status}</span>
                      <button type="button" aria-label="Remove file" onClick={() => setFiles((items) => items.filter((item) => item !== file))}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <form
                className="flex items-end gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-2 shadow-sm"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit();
                }}
              >
                <input ref={fileRef} className="hidden" type="file" multiple accept=".pdf,.docx,.txt,.jpg,.jpeg,.png,.webp" onChange={(event) => addFiles(event.target.files)} />
                <Button size="icon" variant="ghost" type="button" onClick={() => fileRef.current?.click()} aria-label="Attach files">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <textarea
                  className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-2 py-3 text-sm outline-none"
                  rows={1}
                  placeholder={t.input}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      submit();
                    }
                  }}
                />
                <Button size="icon" variant="ghost" type="button" onClick={startVoice} aria-label="Start voice input">
                  <Mic className="h-5 w-5" />
                </Button>
                {isBusy ? (
                  <Button size="icon" variant="secondary" type="button" onClick={stop} aria-label="Stop response">
                    <X className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button size="icon" variant="primary" type="submit" aria-label="Send message">
                    <Send className="h-5 w-5" />
                  </Button>
                )}
              </form>
              {voiceMessage && <p className="mt-2 text-xs text-[var(--muted)]">{voiceMessage}</p>}
            </div>
          </div>
        </section>
      </div>
      <SettingsPanel
        open={settingsOpen}
        language={language}
        theme={theme}
        model={model}
        onClose={() => setSettingsOpen(false)}
        onLanguageChange={setLanguage}
        onThemeChange={setTheme}
        onModelChange={setModel}
        onClearHistory={clearHistory}
      />
    </main>
  );
}
