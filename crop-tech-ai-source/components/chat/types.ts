import type { UIMessage } from "ai";
import type { UploadedArtifact } from "@/lib/tools/document";

export type Language = "en" | "ar";
export type Theme = "light" | "dark" | "system";

export type StoredConversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: UIMessage[];
};

export type ComposerFile = UploadedArtifact & {
  size: number;
  status: string;
};
