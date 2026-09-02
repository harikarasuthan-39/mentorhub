import { z } from "zod";

export const createMeetingSchema = z.object({
  studentId: z.string().min(1),
  meetingDate: z.string().min(1),
  meetingType: z.enum(["INDIVIDUAL", "GROUP"]).default("INDIVIDUAL"),
  discussionSummary: z.string().min(1, "Discussion summary is required"),
  studentConcerns: z.string().optional(),
  mentorSuggestions: z.string().optional(),
  nextFollowUpDate: z.string().optional(),
});

export const updateMeetingSchema = createMeetingSchema.partial();
