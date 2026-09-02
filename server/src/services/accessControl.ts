import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { JwtPayload } from "../utils/jwt";

/** Resolves the Mentor record id for a logged-in mentor user, or throws. */
export async function requireMentorId(user: JwtPayload): Promise<string> {
  const mentor = await prisma.mentor.findUnique({ where: { userId: user.userId } });
  if (!mentor) throw ApiError.forbidden("No mentor profile associated with this account");
  return mentor.id;
}

/** Resolves the Student record id for a logged-in student user, or throws. */
export async function requireStudentId(user: JwtPayload): Promise<string> {
  const student = await prisma.student.findUnique({ where: { userId: user.userId } });
  if (!student) throw ApiError.forbidden("No student profile associated with this account");
  return student.id;
}

/**
 * Ensures a mentor may only act on students assigned to them.
 * HOD has read-only visibility across all students (enforced separately at the route level).
 */
export async function assertMentorOwnsStudent(mentorId: string, studentId: string) {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) throw ApiError.notFound("Student not found");
  if (student.mentorId !== mentorId) {
    throw ApiError.forbidden("This student is not assigned to you");
  }
  return student;
}

/** Personal/well-being issues are restricted to the assigned mentor and HOD only. */
export function canViewRestrictedIssue(user: JwtPayload, issueMentorUserAllowed: boolean) {
  if (user.role === "HOD") return true;
  if (user.role === "MENTOR") return issueMentorUserAllowed;
  return false;
}
