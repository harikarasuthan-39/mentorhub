import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as notificationService from "../services/notificationService";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const unreadOnly = req.query.unread === "true";
  const data = await notificationService.listNotifications(req.user!, unreadOnly);
  res.json({ success: true, data });
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const data = await notificationService.markAsRead(req.user!, req.params.id);
  res.json({ success: true, data });
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAllAsRead(req.user!);
  res.json({ success: true, message: "All notifications marked as read" });
});

export const broadcast = asyncHandler(async (req: Request, res: Response) => {
  const result = await notificationService.broadcastNotification(req.user!, req.body);
  res.status(201).json({ success: true, data: result, message: `Notification sent to ${result.totalRecipients} recipients` });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.deleteNotification(req.user!, req.params.id);
  res.json({ success: true, message: "Notification deleted" });
});
