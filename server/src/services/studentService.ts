import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { JwtPayload } from "../utils/jwt";

export interface StudentListFilters {
  search?: string;
  departmentId?: string;
  year?: string;
  section?: string;
  mentorId?: string;
  riskLevel?: string;
}

/** Scopes the base student query according to the caller's role. */
async function scopedWhere(user: JwtPayload, filters: StudentListFilters) {
  const where: Record<string, unknown> = {};

  if (user.role === "MENTOR") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.userId } });
    if (!mentor) throw ApiError.forbidden("No mentor profile found");
    where.mentorId = mentor.id;
  } else if (user.role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId: user.userId } });
    if (!student) throw ApiError.forbidden("No student profile found");
    where.id = student.id;
  }
  // HOD: no restriction (read-only across department, enforced at controller level for writes)

  if (filters.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: "insensitive" } },
      { registerNumber: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.departmentId) where.departmentId = filters.departmentId;
  if (filters.year) where.year = filters.year;
  if (filters.section) where.section = filters.section;
  if (filters.mentorId && user.role !== "MENTOR") where.mentorId = filters.mentorId;

  return where;
}

export async function listStudents(user: JwtPayload, filters: StudentListFilters, page = 1, pageSize = 20) {
  const where = await scopedWhere(user, filters);

  const [items, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: {
        department: true,
        mentor: { select: { id: true, fullName: true } },
        riskAssessments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { fullName: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.student.count({ where }),
  ]);

  let mapped = items.map((s) => ({
    ...s,
    latestRisk: s.riskAssessments[0] ?? null,
    riskAssessments: undefined,
  }));

  if (filters.riskLevel) {
    mapped = mapped.filter((s) => s.latestRisk?.riskLevel === filters.riskLevel);
  }

  return { items: mapped, total, page, pageSize };
}

export async function getStudentByUserId(userId: string) {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      department: true,
      mentor: { select: { id: true, fullName: true, employeeId: true, phone: true, designation: true, user: { select: { email: true } } } },
      riskAssessments: { orderBy: { createdAt: "desc" }, take: 5 },
      meetings: { orderBy: { meetingDate: "desc" }, take: 10 },
      issues: { orderBy: { createdAt: "desc" }, take: 10 },
      actionItems: { orderBy: { targetCompletionDate: "asc" }, take: 15 },
    },
  });
  if (!student) throw ApiError.notFound("Student record not found for this user account");

  const maskedAccountNumber = student.accountNumber
    ? `XXXX XXXX ${String(student.accountNumber).slice(-4)}`
    : null;

  const { accountNumber, ...safeStudent } = student;
  return {
    ...safeStudent,
    maskedAccountNumber,
  };
}

export async function getStudentById(user: JwtPayload, studentId: string) {
  const where = await scopedWhere(user, {});
  const student = await prisma.student.findFirst({
    where: { ...where, id: studentId },
    include: {
      department: true,
      mentor: { select: { id: true, fullName: true, employeeId: true, phone: true, designation: true } },
      riskAssessments: { orderBy: { createdAt: "desc" }, take: 5 },
      meetings: { orderBy: { meetingDate: "desc" }, take: 10 },
      issues: { orderBy: { createdAt: "desc" }, take: 10 },
      actionItems: { orderBy: { targetCompletionDate: "asc" }, take: 15 },
    },
  });
  if (!student) throw ApiError.notFound("Student not found or not accessible");

  // Always mask sensitive financial account number by default
  const maskedAccountNumber = student.accountNumber
    ? `XXXX XXXX ${String(student.accountNumber).slice(-4)}`
    : "XXXX XXXX 0000";

  const { accountNumber, ...safeStudent } = student;
  return {
    ...safeStudent,
    maskedAccountNumber,
  };
}

export async function getStudentFinancialDetails(user: JwtPayload, studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { department: true },
  });
  if (!student) throw ApiError.notFound("Student not found");

  // Security check: Only the student themselves or HOD can access raw bank details
  if (user.role === "STUDENT") {
    if (student.userId !== user.userId) {
      throw ApiError.forbidden("Access denied: You can only view your own bank details");
    }
  } else if (user.role === "MENTOR") {
    throw ApiError.forbidden("Faculty mentors do not have permission to view student financial details");
  }

  return {
    bankName: student.bankName || null,
    accountHolderName: student.accountHolderName || student.fullName,
    accountNumber: student.accountNumber || null,
    ifscCode: student.ifscCode || null,
    branch: (student as any).branch || null,
  };
}

export async function createStudent(user: JwtPayload, data: Record<string, any>) {
  if (user.role === "STUDENT") throw ApiError.forbidden("Students cannot create student records");

  let mentorId = data.mentorId;
  if (user.role === "MENTOR") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.userId } });
    if (!mentor) throw ApiError.forbidden("No mentor profile found");
    mentorId = mentor.id; // Mentors can only add students under themselves
  }

  return prisma.student.create({
    data: {
      fullName: data.fullName,
      registerNumber: data.registerNumber,
      year: data.year,
      section: data.section,
      departmentId: data.departmentId,
      mentorId,
      parentName: data.parentName,
      parentContact: data.parentContact,
      email: data.email || undefined,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      admissionYear: data.admissionYear,
      attendancePercentage: data.attendancePercentage ?? 100,
      cgpa: data.cgpa ?? 0,
      arrearCount: data.arrearCount ?? 0,
      placementStatus: data.placementStatus ?? "NOT_ELIGIBLE",
      internshipStatus: data.internshipStatus ?? "NOT_STARTED",
      certificationCount: data.certificationCount ?? 0,
    },
  });
}

export async function updateStudent(user: JwtPayload, studentId: string, data: Record<string, any>) {
  if (user.role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId: user.userId } });
    if (!student || student.id !== studentId) {
      throw ApiError.forbidden("You can only edit your own student profile");
    }

    // Permitted fields for student self-service edit
    const allowedFields = [
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "emergencyContactName",
      "emergencyContactRelation",
      "emergencyContactPhone",
      "parentName",
      "parentContact",
      "careerGoal",
      "targetRole",
      "skills",
      "certifications",
      "githubUrl",
      "linkedinUrl",
      "portfolioUrl",
      "resumeUrl",
      "bio",
      "interests",
      "profilePicture",
    ];

    const payload: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        payload[key] = data[key];
      }
    }

    if (data.profilePicture !== undefined && student.userId) {
      await prisma.user.update({
        where: { id: student.userId },
        data: { profilePicture: data.profilePicture },
      });
    }

    return prisma.student.update({ where: { id: studentId }, data: payload });
  }

  await getStudentById(user, studentId); // ensures scoped access for mentors/hod

  const payload: Record<string, unknown> = { ...data };
  if (data.dateOfBirth) payload.dateOfBirth = new Date(data.dateOfBirth);
  if (data.email === "") payload.email = null;

  return prisma.student.update({ where: { id: studentId }, data: payload });
}

export async function deleteStudent(user: JwtPayload, studentId: string) {
  if (user.role !== "MENTOR" && user.role !== "HOD") throw ApiError.forbidden();
  await getStudentById(user, studentId);
  return prisma.student.delete({ where: { id: studentId } });
}
