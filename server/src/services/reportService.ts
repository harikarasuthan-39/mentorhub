import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { JwtPayload } from "../utils/jwt";

export async function getStudentReport(user: JwtPayload, studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      department: true,
      mentor: { select: { fullName: true, employeeId: true, phone: true } },
      meetings: { orderBy: { meetingDate: "desc" } },
      issues: { orderBy: { createdAt: "desc" } },
      actionItems: { orderBy: { targetCompletionDate: "desc" } },
      riskAssessments: { orderBy: { createdAt: "desc" }, take: 5 },
      interventions: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!student) throw ApiError.notFound("Student not found");

  if (user.role === "MENTOR") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.userId } });
    if (!mentor || mentor.id !== student.mentorId) throw ApiError.forbidden();
  }

  const visibleIssues = student.issues.filter((i) => {
    if (!i.isRestricted) return true;
    return user.role === "HOD" || user.role === "MENTOR";
  });

  return { ...student, issues: visibleIssues };
}

export async function getMentorReport(user: JwtPayload, mentorId: string) {
  if (user.role === "MENTOR") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.userId } });
    if (!mentor || mentor.id !== mentorId) throw ApiError.forbidden();
  }

  const mentor = await prisma.mentor.findUnique({ where: { id: mentorId }, include: { department: true } });
  if (!mentor) throw ApiError.notFound("Mentor not found");

  const students = await prisma.student.findMany({ where: { mentorId } });
  const studentIds = students.map((s) => s.id);

  const [meetings, actions, risks] = await Promise.all([
    prisma.meeting.count({ where: { mentorId } }),
    prisma.actionItem.groupBy({ by: ["status"], where: { mentorId }, _count: { status: true } }),
    prisma.riskAssessment.findMany({ where: { studentId: { in: studentIds } }, orderBy: { createdAt: "desc" } }),
  ]);

  const latestByStudent = new Map<string, string>();
  for (const r of risks) if (!latestByStudent.has(r.studentId)) latestByStudent.set(r.studentId, r.riskLevel);
  const highRisk = [...latestByStudent.values()].filter((l) => l === "HIGH" || l === "CRITICAL").length;

  const actionMap = Object.fromEntries(actions.map((a) => [a.status, a._count.status]));

  return {
    mentor,
    totalStudents: students.length,
    meetings,
    highRiskStudents: highRisk,
    pendingFollowUps: students.length ? await prisma.meeting.count({ where: { mentorId, nextFollowUpDate: { gte: new Date() } } }) : 0,
    completedActions: actionMap["COMPLETED"] ?? 0,
    pendingActions: (actionMap["PENDING"] ?? 0) + (actionMap["IN_PROGRESS"] ?? 0),
  };
}

export async function getMonthlyReport(user: JwtPayload, month: number, year: number, mentorId?: string) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const where: Record<string, unknown> = { meetingDate: { gte: start, lt: end } };
  if (user.role === "MENTOR") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.userId } });
    if (!mentor) throw ApiError.forbidden();
    where.mentorId = mentor.id;
  } else if (mentorId) {
    where.mentorId = mentorId;
  }

  const meetings = await prisma.meeting.findMany({ where, select: { studentId: true, mentorId: true } });
  const studentsSet = new Set(meetings.map((m) => m.studentId));

  const issueWhere: Record<string, unknown> = { createdAt: { gte: start, lt: end } };
  if (where.mentorId) issueWhere.mentorId = where.mentorId;
  const [issuesCreated, issuesResolved, actionsAssigned, actionsCompleted, followUpsCompleted] = await Promise.all([
    prisma.studentIssue.count({ where: issueWhere }),
    prisma.studentIssue.count({ where: { ...issueWhere, resolvedDate: { gte: start, lt: end } } }),
    prisma.actionItem.count({ where: { createdAt: { gte: start, lt: end }, ...(where.mentorId ? { mentorId: where.mentorId } : {}) } }),
    prisma.actionItem.count({ where: { completedDate: { gte: start, lt: end }, ...(where.mentorId ? { mentorId: where.mentorId } : {}) } }),
    prisma.meeting.count({ where: { nextFollowUpDate: { gte: start, lt: end } } }),
  ]);

  const risks = await prisma.riskAssessment.findMany({
    where: { studentId: { in: [...studentsSet] } },
    orderBy: { createdAt: "desc" },
  });
  const latestByStudent = new Map<string, string>();
  for (const r of risks) if (!latestByStudent.has(r.studentId)) latestByStudent.set(r.studentId, r.riskLevel);
  const highRiskStudents = [...latestByStudent.values()].filter((l) => l === "HIGH" || l === "CRITICAL").length;

  return {
    period: { month, year },
    meetingsConducted: meetings.length,
    studentsMentored: studentsSet.size,
    issuesIdentified: issuesCreated,
    issuesResolved,
    actionsAssigned,
    actionsCompleted,
    followUpsCompleted,
    highRiskStudents,
  };
}

export async function getSemesterReport(user: JwtPayload, startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const where: Record<string, unknown> = {};
  if (user.role === "MENTOR") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.userId } });
    if (!mentor) throw ApiError.forbidden();
    where.mentorId = mentor.id;
  }

  const students = await prisma.student.findMany({ where: where.mentorId ? { mentorId: where.mentorId } : {} });
  const studentIds = students.map((s) => s.id);

  const [meetings, issuesTotal, issuesResolved, risks] = await Promise.all([
    prisma.meeting.count({ where: { studentId: { in: studentIds }, meetingDate: { gte: start, lte: end } } }),
    prisma.studentIssue.count({ where: { studentId: { in: studentIds }, createdAt: { gte: start, lte: end } } }),
    prisma.studentIssue.count({ where: { studentId: { in: studentIds }, resolvedDate: { gte: start, lte: end } } }),
    prisma.riskAssessment.findMany({ where: { studentId: { in: studentIds } }, orderBy: { createdAt: "desc" } }),
  ]);

  const latestByStudent = new Map<string, string>();
  for (const r of risks) if (!latestByStudent.has(r.studentId)) latestByStudent.set(r.studentId, r.riskLevel);
  const highRiskStudents = [...latestByStudent.values()].filter((l) => l === "HIGH" || l === "CRITICAL").length;

  const avgAttendance = students.length
    ? students.reduce((sum, s) => sum + s.attendancePercentage, 0) / students.length
    : 0;
  const totalArrears = students.reduce((sum, s) => sum + s.arrearCount, 0);
  const placementEligible = students.filter((s) => s.placementStatus !== "NOT_ELIGIBLE").length;
  const placed = students.filter((s) => s.placementStatus === "PLACED").length;
  const internshipCompleted = students.filter((s) => s.internshipStatus === "COMPLETED").length;
  const totalCertifications = students.reduce((sum, s) => sum + s.certificationCount, 0);

  return {
    period: { startDate, endDate },
    totalStudents: students.length,
    totalMeetings: meetings,
    totalIssues: issuesTotal,
    resolvedIssues: issuesResolved,
    highRiskStudents,
    attendance: { average: Number(avgAttendance.toFixed(1)) },
    arrears: { total: totalArrears },
    placement: { eligible: placementEligible, placed },
    internship: { completed: internshipCompleted },
    certifications: { total: totalCertifications },
  };
}

export async function getIssueAnalysisReport(user: JwtPayload) {
  const where: Record<string, unknown> = {};
  if (user.role === "MENTOR") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.userId } });
    if (!mentor) throw ApiError.forbidden();
    where.mentorId = mentor.id;
  }

  const [byCategory, bySeverity, byStatus, total] = await Promise.all([
    prisma.studentIssue.groupBy({ by: ["category"], where, _count: { category: true } }),
    prisma.studentIssue.groupBy({ by: ["severity"], where, _count: { severity: true } }),
    prisma.studentIssue.groupBy({ by: ["status"], where, _count: { status: true } }),
    prisma.studentIssue.count({ where }),
  ]);

  const repeated = await prisma.studentIssue.groupBy({
    by: ["studentId", "category"],
    where,
    _count: { category: true },
    having: { category: { _count: { gte: 2 } } },
  });

  return {
    totalIssues: total,
    byCategory: byCategory.map((c) => ({ category: c.category, count: c._count.category, pct: total ? Math.round((c._count.category / total) * 100) : 0 })),
    bySeverity: bySeverity.map((s) => ({ severity: s.severity, count: s._count.severity })),
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.status })),
    repeatedIssueCount: repeated.length,
  };
}

export async function getActionCompletionReport(user: JwtPayload) {
  const where: Record<string, unknown> = {};
  if (user.role === "MENTOR") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.userId } });
    if (!mentor) throw ApiError.forbidden();
    where.mentorId = mentor.id;
  }

  const grouped = await prisma.actionItem.groupBy({ by: ["status"], where, _count: { status: true } });
  const total = grouped.reduce((sum, g) => sum + g._count.status, 0);
  const map = Object.fromEntries(grouped.map((g) => [g.status, g._count.status]));

  return {
    total,
    pending: map["PENDING"] ?? 0,
    inProgress: map["IN_PROGRESS"] ?? 0,
    completed: map["COMPLETED"] ?? 0,
    overdue: map["OVERDUE"] ?? 0,
    completionPercentage: total ? Math.round(((map["COMPLETED"] ?? 0) / total) * 100) : 0,
  };
}
