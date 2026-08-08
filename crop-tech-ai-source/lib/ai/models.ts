export const DEFAULT_MODEL = process.env.AI_MODEL || "anthropic/claude-sonnet-4.6";
export const DEFAULT_VISION_MODEL = process.env.AI_VISION_MODEL || DEFAULT_MODEL;

export const demoModels = [
  { id: DEFAULT_MODEL, label: "Gateway default" },
  { id: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
  { id: "openai/gpt-5.2", label: "GPT-5.2" },
  { id: "google/gemini-3-flash", label: "Gemini 3 Flash" }
];
