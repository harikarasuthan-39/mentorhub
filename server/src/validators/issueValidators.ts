import { z } from "zod";

export const createIssueSchema = z.object({
  studentId: z.string().min(1),
  meetingId: z.string().optional(),
  category: z.enum([
    "ACADEMIC_PERFORMANCE",
    "ATTENDANCE",
    "ARREAR_SUBJECTS",
    "PLACEMENT_READINESS",
    "INTERNSHIP_STATUS",
    "FINANCIAL_CONCERNS",
    "PERSONAL_WELLBEING",
    "DISCIPLINE",
    "OTHER",
  ]),
  description: z.string().min(1),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
});

export const updateIssueSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  resolution: z.string().optional(),
  description: z.string().optional(),
});
