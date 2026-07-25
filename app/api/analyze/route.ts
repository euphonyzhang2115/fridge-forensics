import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { DEMO_MODE } from "@/config";
import { DEMO_RESULTS } from "@/mockData";
import type { AnalyzeResponse } from "@/types";

const anthropic = new Anthropic();

type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

const SYSTEM_PROMPT = `You are analyzing a photo of the inside of a refrigerator.

Respond with ONLY a single JSON object matching this exact shape and nothing else — no markdown code fences, no explanation, no preamble, no trailing text:

{
  "items": [{ "name": string, "quantity": string, "confidence": "high" | "low" }],
  "recipes": [{ "title": string, "usesItems": string[], "missingItems"?: string[] }],
  "priority": [{ "name": string, "reason": string, "expiresOn"?: string }],
  "shopping": [{ "name": string, "reason": string }],
  "unlock": { "item": string, "unlocks": string[] } | null
}

Rules:
- "items": every distinct food item you can identify, with a rough quantity and your confidence ("high" or "low") in that identification.
- "recipes": 1-3 recipes mostly makeable from the identified items; list anything needed but not visible in "missingItems".
- "priority": at most 3 items, ordered most urgent to use first. Base "reason" on typical shelf life *after opening* for that category of food (e.g. "Opened milk is typically good for about a week"), not on spoilage claims about this specific photo. Only include "expiresOn" when you can reasonably estimate a date from typical shelf life.
- "shopping": at most 4 items. Only include an item if it unlocks one of the listed "recipes" (i.e. it appears in that recipe's "missingItems"). Do not include generic pantry staples like salt, pepper, oil, or water unless a recipe specifically calls for a less common variant of one.
- "unlock": find the single ingredient from "missingItems" across all "recipes" that appears in the most recipes — buying it would complete the greatest number of additional recipes. Set "item" to that ingredient and "unlocks" to the titles of every recipe it appears in. If several ingredients tie, pick whichever is most central to those recipes. If no recipe has any "missingItems", set "unlock" to null.

Output raw JSON only.`;

function parseImageBase64(imageBase64: string): {
  mediaType: ImageMediaType;
  data: string;
} {
  const dataUrlMatch = imageBase64.match(
    /^data:(image\/[a-zA-Z]+);base64,([\s\S]+)$/,
  );
  if (!dataUrlMatch) {
    return { mediaType: "image/jpeg", data: imageBase64 };
  }
  const [, mimeType, data] = dataUrlMatch;
  const mediaType: ImageMediaType =
    mimeType === "image/png" ||
    mimeType === "image/gif" ||
    mimeType === "image/webp"
      ? mimeType
      : "image/jpeg";
  return { mediaType, data };
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```[a-zA-Z]*\n?([\s\S]*?)\n?```$/);
  return fenced ? fenced[1].trim() : trimmed;
}

function isUnlockShape(value: unknown): boolean {
  if (value === null) return true;
  if (typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.item === "string" && Array.isArray(v.unlocks);
}

function isAnalyzeResponseShape(value: unknown): value is AnalyzeResponse {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.items) &&
    Array.isArray(v.recipes) &&
    Array.isArray(v.priority) &&
    Array.isArray(v.shopping) &&
    isUnlockShape(v.unlock)
  );
}

export async function POST(request: Request) {
  let imageBase64: unknown;
  try {
    const body = await request.json();
    imageBase64 = body?.imageBase64;
  } catch {
    return NextResponse.json(
      { error: "Request body must be JSON." },
      { status: 400 },
    );
  }

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return NextResponse.json(
      { error: "Missing imageBase64 in request body." },
      { status: 400 },
    );
  }

  if (DEMO_MODE) {
    return NextResponse.json(DEMO_RESULTS);
  }

  const { mediaType, data } = parseImageBase64(imageBase64);

  let response;
  try {
    response = await anthropic.messages.create({
      model: "claude-opus-5",
      max_tokens: 4096,
      output_config: { effort: "medium" },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data },
            },
            {
              type: "text",
              text: "Analyze this fridge photo and return the JSON described in the system prompt.",
            },
          ],
        },
      ],
    });
  } catch (err) {
    console.error("Anthropic API request failed:", err);
    return NextResponse.json(
      { error: "Failed to reach the analysis model." },
      { status: 502 },
    );
  }

  if (response.stop_reason === "refusal") {
    return NextResponse.json(
      { error: "The model declined to analyze this image." },
      { status: 502 },
    );
  }

  const textBlock = response.content.find((block) => block.type === "text");
  const rawText = textBlock?.text ?? "";
  const cleaned = stripCodeFences(rawText);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse the model's response as JSON.", raw: rawText },
      { status: 502 },
    );
  }

  if (!isAnalyzeResponseShape(parsed)) {
    return NextResponse.json(
      {
        error: "Model response did not match the expected shape.",
        raw: rawText,
      },
      { status: 502 },
    );
  }

  return NextResponse.json(parsed);
}
