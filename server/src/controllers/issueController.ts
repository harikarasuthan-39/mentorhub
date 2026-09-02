import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as issueService from "../services/issueService";
import { createIssueSchema, updateIssueSchema } from "../validators/issueValidators";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, category, severity, status } = req.query;
  const issues = await issueService.listIssues(req.user!, {
    studentId: studentId as string,
    category: category as string,
    severity: severity as string,
    status: status as string,
  });
  res.json({ success: true, data: issues });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = createIssueSchema.parse(req.body);
  const issue = await issueService.createIssue(req.user!, req, data);
  res.status(201).json({ success: true, data: issue });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = updateIssueSchema.parse(req.body);
  const issue = await issueService.updateIssue(req.user!, req, req.params.id, data);
  res.json({ success: true, data: issue });
});
