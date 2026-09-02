import { getAiProvider } from "./aiProvider";

export interface MeetingSummaryInput {
  discussionSummary: string;
  studentConcerns?: string | null;
  mentorSuggestions?: string | null;
}

export interface MeetingSummaryOutput {
  summary: string;
  key_concerns: string[];
  important_points: string[];
  recommended_actions: string[];
}

const SYSTEM_PROMPT = `You are a decision-support assistant for university mentors. You summarize mentor-student
meeting notes for a mentoring record system. Your output is ALWAYS a strict JSON object with keys:
summary (string), key_concerns (string array), important_points (string array), recommended_actions (string array).

Rules:
- Base your output ONLY on the text provided. Never invent facts about the student.
- Never diagnose medical or psychological conditions.
- Never make disciplinary or irreversible decisions - only suggest supportive, reversible mentoring actions.
- If personal/well-being concerns are mentioned, flag them plainly but do not speculate about causes.
- Keep the summary concise (2-4 sentences).
- Respond with ONLY the JSON object, no prose, no markdown fences.`;

export async function runMeetingSummaryAgent(input: MeetingSummaryInput): Promise<MeetingSummaryOutput> {
  const provider = getAiProvider();
  const userPrompt = `Meeting Notes:
Discussion Summary: ${input.discussionSummary}
Student Concerns: ${input.studentConcerns ?? "None noted"}
Mentor Suggestions: ${input.mentorSuggestions ?? "None noted"}

Return the structured JSON summary described in your instructions.`;

  const raw = await provider.complete(SYSTEM_PROMPT, userPrompt);
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      summary: String(parsed.summary ?? ""),
      key_concerns: Array.isArray(parsed.key_concerns) ? parsed.key_concerns.map(String) : [],
      important_points: Array.isArray(parsed.important_points) ? parsed.important_points.map(String) : [],
      recommended_actions: Array.isArray(parsed.recommended_actions) ? parsed.recommended_actions.map(String) : [],
    };
  } catch {
    // If the model returned non-JSON, degrade gracefully rather than fail the whole request.
    return {
      summary: cleaned.slice(0, 500),
      key_concerns: [],
      important_points: [],
      recommended_actions: [],
    };
  }
}
