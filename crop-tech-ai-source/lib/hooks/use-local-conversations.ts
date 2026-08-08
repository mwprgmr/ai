"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { UIMessage } from "ai";
import { uid } from "@/lib/utils";
import type { StoredConversation } from "@/components/chat/types";

const STORAGE_KEY = "crop-tech-ai-conversations";

function createConversation(): StoredConversation {
  const now = new Date().toISOString();
  return {
    id: uid("chat"),
    title: "New conversation",
    createdAt: now,
    updatedAt: now,
    messages: []
  };
}

function loadInitialState() {
  if (typeof window === "undefined") {
    const conversation = createConversation();
    return { conversations: [conversation], activeId: conversation.id };
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? (JSON.parse(raw) as StoredConversation[]) : [];
  const conversations = parsed.length ? parsed : [createConversation()];
  return { conversations, activeId: conversations[0].id };
}

export function useLocalConversations() {
  const initial = useMemo(() => loadInitialState(), []);
  const [conversations, setConversations] = useState<StoredConversation[]>(initial.conversations);
  const [activeId, setActiveId] = useState<string>(initial.activeId);
  const loaded = true;

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations, loaded]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) || conversations[0],
    [activeId, conversations]
  );

  const newChat = useCallback(function newChat() {
    const chat = createConversation();
    setConversations((items) => [chat, ...items]);
    setActiveId(chat.id);
  }, []);

  const updateMessages = useCallback(function updateMessages(id: string, messages: UIMessage[]) {
    setConversations((items) =>
      items.map((conversation) => {
        if (conversation.id !== id) return conversation;
        const firstUserText = messages
          .find((message) => message.role === "user")
          ?.parts?.find((part) => part.type === "text")?.text;
        return {
          ...conversation,
          title: conversation.title === "New conversation" && firstUserText ? firstUserText.slice(0, 48) : conversation.title,
          updatedAt: new Date().toISOString(),
          messages
        };
      })
    );
  }, []);

  const renameChat = useCallback(function renameChat(id: string, title: string) {
    setConversations((items) => items.map((conversation) => (conversation.id === id ? { ...conversation, title } : conversation)));
  }, []);

  const deleteChat = useCallback(function deleteChat(id: string) {
    setConversations((items) => {
      const remaining = items.filter((conversation) => conversation.id !== id);
      if (!remaining.length) {
        const replacement = createConversation();
        setActiveId(replacement.id);
        return [replacement];
      }
      if (activeId === id) setActiveId(remaining[0].id);
      return remaining;
    });
  }, [activeId]);

  const clearHistory = useCallback(function clearHistory() {
    const replacement = createConversation();
    setConversations([replacement]);
    setActiveId(replacement.id);
  }, []);

  return {
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
  };
}
