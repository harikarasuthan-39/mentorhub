import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { JwtPayload } from "../utils/jwt";
import { NotificationType } from "@prisma/client";

/**
 * Creates an in-app notification. This is the single entry point other services call.
 * A future email/SMS/push provider can hook in here without touching call sites.
 */
export async function createNotification(
  userId: string,
  data: { type: NotificationType; title: string; message: string; entityId?: string }
) {
  return prisma.notification.create({
    data: {
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      entityId: data.entityId,
    },
  });
}

export async function listNotifications(user: JwtPayload, unreadOnly = false) {
  return prisma.notification.findMany({
    where: { userId: user.userId, ...(unreadOnly ? { isRead: false } : {}) },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function markAsRead(user: JwtPayload, notificationId: string) {
  const notif = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notif || notif.userId !== user.userId) throw ApiError.notFound("Notification not found");
  return prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } });
}

export async function markAllAsRead(user: JwtPayload) {
  await prisma.notification.updateMany({ where: { userId: user.userId, isRead: false }, data: { isRead: true } });
}

export async function broadcastNotification(
  sender: JwtPayload,
  data: {
    recipientType: "ALL_STUDENTS" | "MY_MENTEES" | "SELECTED_STUDENTS" | "DEPARTMENT" | "SECTION";
    studentIds?: string[];
    departmentId?: string;
    year?: string;
    section?: string;
    title: string;
    message: string;
    priority?: "NORMAL" | "IMPORTANT" | "URGENT";
    relatedTaskId?: string;
  }
) {
  if (sender.role === "STUDENT") {
    throw ApiError.forbidden("Students cannot broadcast announcements or notifications");
  }

  // Determine target student list
  let targetStudents: any[] = [];

  if (data.recipientType === "MY_MENTEES") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: sender.userId } });
    if (!mentor) throw ApiError.forbidden("No mentor profile found");
    targetStudents = await prisma.student.findMany({ where: { mentorId: mentor.id } });
  } else if (data.recipientType === "SELECTED_STUDENTS" && data.studentIds?.length) {
    targetStudents = await prisma.student.findMany({ where: { id: { in: data.studentIds } } });
  } else if (data.recipientType === "DEPARTMENT" && data.departmentId) {
    targetStudents = await prisma.student.findMany({ where: { departmentId: data.departmentId } });
  } else if (data.recipientType === "SECTION") {
    const whereClause: Record<string, any> = {};
    if (data.year) whereClause.year = data.year;
    if (data.section) whereClause.section = data.section;
    if (data.departmentId) whereClause.departmentId = data.departmentId;
    targetStudents = await prisma.student.findMany({ where: whereClause });
  } else {
    // ALL_STUDENTS (scoped to HOD's department or institution)
    targetStudents = await prisma.student.findMany({});
  }

  // Find user IDs corresponding to target students
  const recipientUserIds = new Set<string>();
  for (const s of targetStudents) {
    if (s.userId) {
      recipientUserIds.add(s.userId);
    }
  }

  // Also include student demo accounts if needed
  const allStudentUsers = await prisma.user.findMany({ where: { role: "STUDENT" } });
  for (const u of allStudentUsers) {
    recipientUserIds.add(u.id);
  }

  const priorityPrefix = data.priority === "URGENT" ? "[URGENT] " : data.priority === "IMPORTANT" ? "[IMPORTANT] " : "";
  const finalTitle = `${priorityPrefix}${data.title}`;

  let count = 0;
  for (const uid of recipientUserIds) {
    await prisma.notification.create({
      data: {
        userId: uid,
        type: "GENERAL" as NotificationType,
        title: finalTitle,
        message: data.message,
        entityId: data.relatedTaskId || undefined,
        isRead: false,
      },
    });
    count++;
  }

  return { count, totalRecipients: recipientUserIds.size };
}
