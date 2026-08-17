import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { action } from "./_generated/server";

/**
 * Zorbi AI tutor — calls Google Gemini from a Convex action so the API key
 * never touches the client. Returns `ok: false` (with a reason) when the key
 * isn't configured or the request fails; the frontend falls back to its
 * built-in demo replies in that case.
 */

const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = [
  "You are Zorbi, the friendly AI study buddy inside the Zorbi AI learning platform.",
  "You help a student named Fahad with homework, concept explanations, summaries, and quiz prep.",
  "Keep answers clear, warm, and encouraging. Use short paragraphs, bullet points, and simple examples.",
  "If the student goes off-topic, gently steer them back to studying.",
  "Keep replies concise — a few short paragraphs at most, unless the student asks for depth.",
].join(" ");

export const askZorbi = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      }),
    ),
  },
  handler: async (ctx, { messages }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return { ok: false, reason: "auth", reply: "" };
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return { ok: false, reason: "no_key", reply: "" };
    }

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        },
      );

      if (!response.ok) {
        console.error(
          "[tutor] Gemini error",
          response.status,
          await response.text(),
        );
        return { ok: false, reason: "api", reply: "" };
      }

      const data = (await response.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
      if (!reply) {
        return { ok: false, reason: "empty", reply: "" };
      }
      return { ok: true, reason: "ok", reply };
    } catch (err) {
      console.error("[tutor] Gemini request failed", err);
      return { ok: false, reason: "error", reply: "" };
    }
  },
});
