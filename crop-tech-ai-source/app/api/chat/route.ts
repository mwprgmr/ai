import { streamCropTechAgent } from "@/lib/ai/agent";
import type { UIMessage } from "ai";
import type { UploadedArtifact } from "@/lib/tools/document";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL) {
      return Response.json(
        { error: "Unable to connect to the AI service. Please try again.", missingCredentials: true },
        { status: 503 }
      );
    }

    const body = (await req.json()) as {
      messages?: UIMessage[];
      model?: string;
      files?: UploadedArtifact[];
    };

    if (!body.messages?.length) {
      return Response.json({ error: "No messages provided." }, { status: 400 });
    }

    return streamCropTechAgent({
      messages: body.messages,
      model: body.model,
      files: body.files
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unable to connect to the AI service. Please try again." }, { status: 500 });
  }
}
