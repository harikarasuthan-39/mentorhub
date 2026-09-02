import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as meetingService from "../services/meetingService";
import { createMeetingSchema } from "../validators/meetingValidators";
import { logAudit } from "../middleware/audit";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, page, pageSize } = req.query;
  const result = await meetingService.listMeetings(req.user!, {
    studentId: studentId as string,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  res.json({ success: true, data: result });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const meeting = await meetingService.getMeetingById(req.user!, req.params.id);
  res.json({ success: true, data: meeting });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = createMeetingSchema.parse(req.body);
  const meeting = await meetingService.recordMeeting(req.user!, data);
  await logAudit(req, "Meeting Created", "Meeting", meeting.id);
  res.status(201).json({ success: true, data: meeting });
});
