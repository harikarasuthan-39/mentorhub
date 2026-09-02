import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as studentService from "../services/studentService";
import { createStudentSchema, updateStudentSchema } from "../validators/studentValidators";
import { logAudit } from "../middleware/audit";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { search, departmentId, year, section, mentorId, riskLevel, page, pageSize } = req.query;
  const result = await studentService.listStudents(
    req.user!,
    {
      search: search as string,
      departmentId: departmentId as string,
      year: year as string,
      section: section as string,
      mentorId: mentorId as string,
      riskLevel: riskLevel as string,
    },
    page ? Number(page) : 1,
    pageSize ? Number(pageSize) : 20
  );
  res.json({ success: true, data: result });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const student = await studentService.getStudentById(req.user!, req.params.id);
  await logAudit(req, "Student Viewed", "Student", req.params.id);
  res.json({ success: true, data: student });
});

export const getFinancial = asyncHandler(async (req: Request, res: Response) => {
  const financial = await studentService.getStudentFinancialDetails(req.user!, req.params.id);
  await logAudit(req, "Student Financial Details Viewed", "Student", req.params.id);
  res.json({ success: true, data: financial });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = createStudentSchema.parse(req.body);
  const student = await studentService.createStudent(req.user!, data);
  await logAudit(req, "Student Created", "Student", student.id);
  res.status(201).json({ success: true, data: student });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = updateStudentSchema.parse(req.body);
  const student = await studentService.updateStudent(req.user!, req.params.id, data);
  await logAudit(req, "Student Updated", "Student", req.params.id);
  res.json({ success: true, data: student });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await studentService.deleteStudent(req.user!, req.params.id);
  await logAudit(req, "Student Deleted", "Student", req.params.id);
  res.json({ success: true, message: "Student removed successfully" });
});
