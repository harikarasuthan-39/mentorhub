import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as reportService from "../services/reportService";
import * as exportService from "../export/exportService";
import { logAudit } from "../middleware/audit";

export const studentPdf = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.getStudentReport(req.user!, req.params.id);
  await logAudit(req, "Report Generated", "Student", req.params.id, { export: "pdf" });
  exportService.exportStudentPdf(res, report);
});

export const studentExcel = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.getStudentReport(req.user!, req.params.id);
  await logAudit(req, "Report Generated", "Student", req.params.id, { export: "excel" });
  await exportService.exportStudentExcel(res, report);
});

export const monthlyPdf = asyncHandler(async (req: Request, res: Response) => {
  const { month, year } = req.query;
  const now = new Date();
  const report = await reportService.getMonthlyReport(
    req.user!,
    month ? Number(month) : now.getMonth() + 1,
    year ? Number(year) : now.getFullYear()
  );
  await logAudit(req, "Report Generated", "Meeting", undefined, { export: "pdf", type: "monthly" });
  exportService.exportMonthlyPdf(res, report);
});

export const monthlyExcel = asyncHandler(async (req: Request, res: Response) => {
  const { month, year } = req.query;
  const now = new Date();
  const report = await reportService.getMonthlyReport(
    req.user!,
    month ? Number(month) : now.getMonth() + 1,
    year ? Number(year) : now.getFullYear()
  );
  await logAudit(req, "Report Generated", "Meeting", undefined, { export: "excel", type: "monthly" });
  await exportService.exportMonthlyExcel(res, report);
});
