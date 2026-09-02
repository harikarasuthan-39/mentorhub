import { env } from "../config/env";
import { GoogleGenAI } from "@google/genai";

/**
 * Thin abstraction over an LLM provider. Swap providers by changing AI_PROVIDER
 * in the environment. Never called from the frontend - the API key stays server-side.
 */
export interface AiProvider {
  complete(systemPrompt: string, userPrompt: string): Promise<string>;
}

class GeminiProvider implements AiProvider {
  private ai: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = env.geminiApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nInput:\n${userPrompt}` }] },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Gemini returned empty response");
    return text;
  }
}

class AnthropicProvider implements AiProvider {
  async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = env.anthropicApiKey;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: env.aiModel || "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`AI provider request failed (${response.status}): ${text}`);
    }

    const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
    const textBlock = data.content?.find((c) => c.type === "text");
    if (!textBlock) throw new Error("AI provider returned no text content");
    return textBlock.text as string;
  }
}

/**
 * Deterministic mock provider so the whole application is runnable and demoable
 * without any external API key. This is what AI_PROVIDER=mock uses by default.
 */
class MockProvider implements AiProvider {
  async complete(_systemPrompt: string, userPrompt: string): Promise<string> {
    // Local heuristic summarizer used as safe offline fallback.
    const lower = userPrompt.toLowerCase();
    const concerns: string[] = [];
    if (lower.includes("attendance")) concerns.push("Attendance below acceptable threshold");
    if (lower.includes("arrear")) concerns.push("Pending arrear subjects");
    if (lower.includes("math") || lower.includes("academic") || lower.includes("subject")) {
      concerns.push("Academic performance difficulty");
    }
    if (lower.includes("placement")) concerns.push("Placement preparation required");
    if (lower.includes("internship")) concerns.push("Internship guidance required");
    if (lower.includes("financial")) concerns.push("Financial concern raised");
    if (lower.includes("stress") || lower.includes("anxious") || lower.includes("well-being") || lower.includes("personal")) {
      concerns.push("Personal well-being concern flagged for restricted review");
    }
    if (concerns.length === 0) concerns.push("General mentoring discussion, no major concerns identified");

    const actions = concerns.map((c) => `Follow up on: ${c.toLowerCase()}`);

    return JSON.stringify({
      summary:
        "Mentor and student discussed the student's current academic and personal progress. " +
        (concerns.length > 1
          ? "Several key areas were identified that need structured mentor follow-up."
          : "The discussion was routine and positive."),
      key_concerns: concerns,
      important_points: concerns,
      recommended_actions: actions.slice(0, 4),
    });
  }
}

export function getAiProvider(): AiProvider {
  if (env.aiProvider === "anthropic" || (env.anthropicApiKey && !env.geminiApiKey)) return new AnthropicProvider();
  if (env.aiProvider === "gemini" || env.geminiApiKey) return new GeminiProvider();
  return new MockProvider();
}
