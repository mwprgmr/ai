import { convertToModelMessages, createGateway, streamText, stepCountIs, type UIMessage } from "ai";
import { createCropTechTools } from "./tools";
import { DEFAULT_MODEL } from "./models";
import { cropTechSystemPrompt } from "./prompts";
import type { UploadedArtifact } from "@/lib/tools/document";

export async function streamCropTechAgent({
  messages,
  model,
  files
}: {
  messages: UIMessage[];
  model?: string;
  files?: UploadedArtifact[];
}) {
  const tools = createCropTechTools(files);
  const gateway = createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY });
  const result = streamText({
    model: gateway.languageModel(model || DEFAULT_MODEL),
    system: cropTechSystemPrompt,
    messages: await convertToModelMessages(messages, { tools }),
    tools,
    stopWhen: stepCountIs(6)
  });

  return result.toUIMessageStreamResponse();
}
