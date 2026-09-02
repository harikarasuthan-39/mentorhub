import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as reportService from "../services/reportService";
import { logAudit } from "../middleware/audit";

export const studentReport = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getStudentReport(req.user!, req.params.id);
  await logAudit(req, "Report Generated", "Student", req.params.id, { type: "student" });
  res.json({ success: true, data });
});

export const mentorReport = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getMentorReport(req.user!, req.params.id);
  await logAudit(req, "Report Generated", "Mentor", req.params.id, { type: "mentor" });
  res.json({ success: true, data });
});

export const monthlyReport = asyncHandler(async (req: Request, res: Response) => {
  const { month, year, mentorId } = req.query;
  const now = new Date();
  const data = await reportService.getMonthlyReport(
    req.user!,
    month ? Number(month) : now.getMonth() + 1,
    year ? Number(year) : now.getFullYear(),
    mentorId as string
  );
  await logAudit(req, "Report Generated", "Meeting", undefined, { type: "monthly" });
  res.json({ success: true, data });
});

export const semesterReport = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const data = await reportService.getSemesterReport(req.user!, startDate as string, endDate as string);
  await logAudit(req, "Report Generated", "Meeting", undefined, { type: "semester" });
  res.json({ success: true, data });
});

export const issuesReport = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getIssueAnalysisReport(req.user!);
  res.json({ success: true, data });
});

export const actionsReport = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getActionCompletionReport(req.user!);
  res.json({ success: true, data });
});
