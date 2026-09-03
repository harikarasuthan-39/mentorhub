import { env } from "../config/env";
import { GoogleGenAI } from "@google/genai";

export interface ChatTurn {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Thin abstraction over an LLM provider. Swap providers by changing AI_PROVIDER
 * in the environment. Never called from the frontend - the API key stays server-side.
 */
export interface AiProvider {
  complete(systemPrompt: string, userPrompt: string, options?: { json?: boolean }): Promise<string>;
  chat?(systemPrompt: string, messages: ChatTurn[]): Promise<string>;
}

export class GeminiProvider implements AiProvider {
  private ai: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = env.geminiApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  async complete(systemPrompt: string, userPrompt: string, options?: { json?: boolean }): Promise<string> {
    const ai = this.getClient();
    const config: Record<string, any> = {};
    if (options?.json !== false) {
      config.responseMimeType = "application/json";
    }

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.8-flash"];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\nInput:\n${userPrompt}` }] },
          ],
          config,
        });

        const text = response.text;
        if (text && text.trim()) return text.trim();
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error("Gemini returned empty response");
  }

  async chat(systemPrompt: string, messages: ChatTurn[]): Promise<string> {
    const ai = this.getClient();
    const validMessages = messages.filter((m) => m.content && m.content.trim().length > 0);

    const contents = validMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    if (contents.length === 0) {
      contents.push({ role: "user", parts: [{ text: "Hello" }] });
    }

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.8-flash"];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        const text = response.text;
        if (text && text.trim()) return text.trim();
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error("Gemini returned empty response");
  }
}

export class AnthropicProvider implements AiProvider {
  async complete(systemPrompt: string, userPrompt: string, options?: { json?: boolean }): Promise<string> {
    const apiKey = env.anthropicApiKey;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        signal: controller.signal,
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
      if (!textBlock || !textBlock.text) throw new Error("AI provider returned no text content");
      return textBlock.text;
    } finally {
      clearTimeout(timeout);
    }
  }

  async chat(systemPrompt: string, messages: ChatTurn[]): Promise<string> {
    const apiKey = env.anthropicApiKey;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

    const formattedMessages = messages
      .filter((m) => m.role !== "system" && m.content?.trim())
      .map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      }));

    if (formattedMessages.length === 0) {
      formattedMessages.push({ role: "user", content: "Hello" });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: env.aiModel || "claude-3-5-sonnet-20241022",
          max_tokens: 1500,
          system: systemPrompt,
          messages: formattedMessages,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`AI provider request failed (${response.status}): ${text}`);
      }

      const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
      const textBlock = data.content?.find((c) => c.type === "text");
      if (!textBlock || !textBlock.text) throw new Error("AI provider returned no text content");
      return textBlock.text;
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * Deterministic mock provider so the whole application is runnable and demoable
 * without any external API key. This is what AI_PROVIDER=mock uses by default.
 */
export class MockProvider implements AiProvider {
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

/**
 * Resilient Multi-Provider that cascades through:
 * 1. Anthropic (if configured)
 * 2. Gemini (if configured)
 * 3. Mock/Offline Fallback
 */
export class ResilientAiProvider implements AiProvider {
  private anthropic = new AnthropicProvider();
  private gemini = new GeminiProvider();
  private mock = new MockProvider();

  async complete(systemPrompt: string, userPrompt: string, options?: { json?: boolean }): Promise<string> {
    if (env.geminiApiKey || process.env.GEMINI_API_KEY) {
      try {
        return await this.gemini.complete(systemPrompt, userPrompt, options);
      } catch (err: any) {
        console.warn("[AI Provider] Gemini complete failed, trying Anthropic:", err.message);
      }
    }

    if (env.anthropicApiKey) {
      try {
        return await this.anthropic.complete(systemPrompt, userPrompt, options);
      } catch (err: any) {
        console.warn("[AI Provider] Anthropic complete failed, using mock:", err.message);
      }
    }

    return await this.mock.complete(systemPrompt, userPrompt);
  }

  async chat(systemPrompt: string, messages: ChatTurn[]): Promise<string> {
    if (env.geminiApiKey || process.env.GEMINI_API_KEY) {
      try {
        return await this.gemini.chat(systemPrompt, messages);
      } catch (err: any) {
        console.warn("[AI Provider] Gemini chat failed, trying Anthropic:", err.message);
      }
    }

    if (env.anthropicApiKey) {
      try {
        return await this.anthropic.chat(systemPrompt, messages);
      } catch (err: any) {
        console.warn("[AI Provider] Anthropic chat failed:", err.message);
      }
    }

    // Let caller use offline conversational engine
    throw new Error("Live AI providers unavailable, use offline conversational engine");
  }
}

export function getAiProvider(): AiProvider {
  return new ResilientAiProvider();
}
