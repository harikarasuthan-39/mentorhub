import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";

const router = Router();
router.use(authenticate);

// Lightweight lookup endpoints used by frontend dropdowns.
router.get("/", asyncHandler(async (_req, res) => {
  const departments = await prisma.department.findMany({ orderBy: { name: "asc" } });
  res.json({ success: true, data: departments });
}));

router.get("/mentors/all", asyncHandler(async (_req, res) => {
  const mentors = await prisma.mentor.findMany({
    select: { id: true, fullName: true, departmentId: true, employeeId: true },
    orderBy: { fullName: "asc" },
  });
  res.json({ success: true, data: mentors });
}));

export default router;
