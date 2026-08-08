import { tool } from "ai";
import { z } from "zod";
import { calculate, convertCurrency } from "@/lib/tools/calculator";
import { summarizeDocumentInput, type UploadedArtifact } from "@/lib/tools/document";
import { summarizeImageInput } from "@/lib/tools/image";
import { getTime } from "@/lib/tools/time";
import { getWeather } from "@/lib/tools/weather";
import { searchWeb } from "@/lib/tools/web-search";

export function createCropTechTools(files?: UploadedArtifact[]) {
  return {
    webSearch: tool({
      description: "Search the live web for current, recent, local, business, news, sports, law, travel, price, or time-sensitive information. Return real sources only.",
      inputSchema: z.object({
        query: z.string().describe("The search query."),
        maxResults: z.number().min(1).max(8).default(5).describe("Number of search results.")
      }),
      execute: async ({ query, maxResults }) => searchWeb(query, maxResults)
    }),
    weather: tool({
      description: "Get current weather and forecast for a known city or place. Use for going out, rain, temperature, humidity, wind, and forecast questions. If the location is missing or unclear, ask the user which city to check before using this tool.",
      inputSchema: z.object({
        location: z.string().describe("City or place, such as Dubai, Kochi, Riyadh, London."),
        days: z.number().min(1).max(7).default(2)
      }),
      execute: async ({ location, days }) => getWeather(location, days)
    }),
    calculator: tool({
      description: "Accurately evaluate arithmetic expressions where calculation matters.",
      inputSchema: z.object({
        expression: z.string().describe("Arithmetic expression using numbers, parentheses, +, -, *, /, and percentages.")
      }),
      execute: async ({ expression }) => calculate(expression)
    }),
    currencyConverter: tool({
      description: "Convert money using current exchange-rate data when available.",
      inputSchema: z.object({
        amount: z.number(),
        from: z.string().describe("Source ISO currency code, e.g. INR."),
        to: z.string().describe("Target ISO currency code, e.g. SAR.")
      }),
      execute: async ({ amount, from, to }) => convertCurrency(amount, from, to)
    }),
    currentTime: tool({
      description: "Get the current time for a known city or IANA timezone. If the location or timezone is missing or unclear, ask the user what place to check before using this tool.",
      inputSchema: z.object({
        locationOrTimezone: z.string().describe("City, country, or IANA timezone.")
      }),
      execute: async ({ locationOrTimezone }) => getTime(locationOrTimezone)
    }),
    documentAnalysis: tool({
      description: "Read extracted uploaded document text. Use only when the user asks about an uploaded document.",
      inputSchema: z.object({
        request: z.string().describe("What the user wants to know about the document.")
      }),
      execute: async () => summarizeDocumentInput(files)
    }),
    imageAnalysis: tool({
      description: "Access uploaded image data for models that can inspect images. Use only when the user asks about an uploaded image.",
      inputSchema: z.object({
        request: z.string().describe("What the user wants to know about the image.")
      }),
      execute: async () => summarizeImageInput(files)
    })
  };
}
