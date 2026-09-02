import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { runMeetingSummaryAgent } from "../ai/meetingSummaryAgent";
import { computeAndStoreRisk } from "../services/meetingService";
import { recommendInterventions } from "../ai/interventionAgent";
import { prisma } from "../config/prisma";
import * as reportService from "../services/reportService";
import { runMentorChatAgent } from "../ai/mentorChatAgent";

export const chatWithMentorAI = asyncHandler(async (req: Request, res: Response) => {
  const { messages, studentContext } = req.body;
  const result = await runMentorChatAgent({
    messages: Array.isArray(messages) ? messages : [],
    studentContext,
  });
  res.json({ success: true, data: result });
});

export const summarizeMeeting = asyncHandler(async (req: Request, res: Response) => {
  const { discussionSummary, studentConcerns, mentorSuggestions } = req.body;
  const result = await runMeetingSummaryAgent({ discussionSummary, studentConcerns, mentorSuggestions });
  res.json({ success: true, data: result });
});

export const riskAssessment = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.body;
  const result = await computeAndStoreRisk(studentId);
  res.json({ success: true, data: result });
});

export const intervention = asyncHandler(async (req: Request, res: Response) => {
  const { concernAreas } = req.body;
  const result = recommendInterventions(concernAreas ?? []);
  res.json({ success: true, data: result });
});

export const analyzeIssues = asyncHandler(async (req: Request, res: Response) => {
  const result = await reportService.getIssueAnalysisReport(req.user!);
  res.json({ success: true, data: result });
});
