import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema, registerSchema } from "../validators/authValidators";
import * as authService from "../services/authService";
import { logAudit } from "../middleware/audit";
import { ApiError } from "../utils/ApiError";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const result = await authService.login(data.email, data.password);
  await logAudit(req, "User Login", "User", (result.user as any).id);
  res.json({ success: true, data: result });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  if (data.role === "STUDENT") {
    throw ApiError.badRequest("Student accounts are provisioned by a mentor via the student record.");
  }
  const result = await authService.registerMentorOrHod(data);
  res.status(201).json({ success: true, data: result });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.userId);
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const updated = await authService.updateOwnProfile(req.user!.userId, req.user!.role, req.body);
  await logAudit(req, "Profile Updated", "User", req.user!.userId);
  res.json({ success: true, data: updated, message: "Profile updated successfully" });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw ApiError.badRequest("Current password and new password are required");
  }
  const result = await authService.changePassword(req.user!.userId, currentPassword, newPassword);
  await logAudit(req, "Password Changed", "User", req.user!.userId);
  res.json({ success: true, message: result.message });
});

export const listStaff = asyncHandler(async (req: Request, res: Response) => {
  const departmentId = req.query.departmentId as string | undefined;
  const staff = await authService.listStaff(departmentId);
  res.json({ success: true, data: staff });
});

export const updateStaff = asyncHandler(async (req: Request, res: Response) => {
  if (req.user!.role !== "HOD") {
    throw ApiError.forbidden("Only HODs can update faculty records");
  }
  const updated = await authService.updateStaffRecord(req.params.id, req.body);
  await logAudit(req, "Staff Record Updated", "Mentor", req.params.id);
  res.json({ success: true, data: updated, message: "Staff record updated successfully" });
});
