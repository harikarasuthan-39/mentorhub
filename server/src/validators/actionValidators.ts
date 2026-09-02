import { z } from "zod";

export const createActionSchema = z.object({
  studentId: z.string().min(1),
  meetingId: z.string().optional(),
  issueId: z.string().optional(),
  actionType: z.enum(["STUDENT_ACTION", "MENTOR_ACTION"]).default("STUDENT_ACTION"),
  description: z.string().min(1),
  assignedTo: z.string().min(1),
  targetCompletionDate: z.string().min(1),
});

export const updateActionSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE"]).optional(),
  description: z.string().optional(),
  targetCompletionDate: z.string().optional(),
});
