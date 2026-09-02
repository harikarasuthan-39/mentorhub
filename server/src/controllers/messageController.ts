import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { messageService } from "../services/messageService";
import { ApiError } from "../utils/ApiError";

export const getConversations = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const conversations = await messageService.getConversations(req.user.userId, req.user.role as any);
  res.json({ success: true, data: conversations });
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const { otherUserId } = req.params;
  const messages = await messageService.getMessages(req.user.userId, otherUserId);
  res.json({ success: true, data: messages });
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const { recipientUserId, content } = req.body;
  if (!recipientUserId || !content) {
    throw ApiError.badRequest("Recipient ID and message content are required");
  }
  const message = await messageService.sendMessage(req.user.userId, recipientUserId, content);
  res.status(201).json({ success: true, data: message });
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const { otherUserId } = req.params;
  const result = await messageService.markConversationRead(req.user.userId, otherUserId);
  res.json({ success: true, data: result });
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const unreadCount = await messageService.getUnreadCount(req.user.userId);
  res.json({ success: true, data: { unreadCount } });
});

export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const contacts = await messageService.getAvailableContacts(req.user.userId, req.user.role as any);
  res.json({ success: true, data: contacts });
});
