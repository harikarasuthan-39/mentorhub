import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as actionService from "../services/actionService";
import { createActionSchema, updateActionSchema } from "../validators/actionValidators";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, status } = req.query;
  const actions = await actionService.listActions(req.user!, {
    studentId: studentId as string,
    status: status as string,
  });
  res.json({ success: true, data: actions });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = createActionSchema.parse(req.body);
  const action = await actionService.createAction(req.user!, req, data);
  res.status(201).json({ success: true, data: action });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = updateActionSchema.parse(req.body);
  const action = await actionService.updateAction(req.user!, req, req.params.id, data);
  res.json({ success: true, data: action });
});
