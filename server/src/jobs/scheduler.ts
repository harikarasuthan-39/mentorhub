import cron from "node-cron";
import { prisma } from "../config/prisma";
import { sweepOverdueActions } from "../services/actionService";
import { createNotification } from "../services/notificationService";

/**
 * Background jobs. In development these run in-process via node-cron; in production
 * this module can be extracted into a separate worker process if desired.
 */
export function startScheduledJobs() {
  // Every day at 07:00 - overdue action sweep + overdue alerts
  cron.schedule("0 7 * * *", async () => {
    const count = await sweepOverdueActions();
    if (count > 0) console.log(`Marked ${count} action item(s) as overdue`);
    await notifyOverdueActions();
  });

  // Every day at 07:30 - upcoming meeting / follow-up reminders (next 24h)
  cron.schedule("30 7 * * *", async () => {
    await notifyUpcomingFollowUps();
  });

  // Every day at 08:00 - repeated issue alerts
  cron.schedule("0 8 * * *", async () => {
    await notifyRepeatedIssues();
  });

  // 1st of every month at 09:00 - monthly mentoring record reminder
  cron.schedule("0 9 1 * *", async () => {
    await notifyMonthlyReminder();
  });

  console.log("Scheduled background jobs started");
}

async function notifyOverdueActions() {
  const overdue = await prisma.actionItem.findMany({
    where: { status: "OVERDUE" },
    include: { mentor: { include: { user: true } }, student: true },
  });
  for (const item of overdue) {
    await createNotification(item.mentor.user.id, {
      type: "OVERDUE_ACTION",
      title: "Action item overdue",
      message: `"${item.description}" for ${item.student.fullName} was due ${item.targetCompletionDate.toLocaleDateString()}.`,
      entityId: item.id,
    });
  }
}

async function notifyUpcomingFollowUps() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  const endOfTomorrow = new Date(startOfTomorrow);
  endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);

  const meetings = await prisma.meeting.findMany({
    where: { nextFollowUpDate: { gte: startOfTomorrow, lt: endOfTomorrow } },
    include: { mentor: { include: { user: true } }, student: true },
  });

  for (const meeting of meetings) {
    await createNotification(meeting.mentor.user.id, {
      type: "FOLLOW_UP",
      title: "Follow-up due tomorrow",
      message: `Follow up with ${meeting.student.fullName} is scheduled for tomorrow.`,
      entityId: meeting.id,
    });
  }
}

async function notifyRepeatedIssues() {
  const grouped = await prisma.studentIssue.groupBy({
    by: ["studentId", "category"],
    where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    _count: { category: true },
    having: { category: { _count: { gte: 3 } } },
  });

  for (const g of grouped) {
    const student = await prisma.student.findUnique({ where: { id: g.studentId }, include: { mentor: { include: { user: true } } } });
    if (!student) continue;
    await createNotification(student.mentor.user.id, {
      type: "REPEATED_ISSUE",
      title: "Repeated issue alert",
      message: `${student.fullName} has reported ${g.category.replace(/_/g, " ").toLowerCase()} issues ${g._count.category} times.`,
      entityId: student.id,
    });
  }
}

async function notifyMonthlyReminder() {
  const mentors = await prisma.mentor.findMany({ include: { user: true } });
  const monthName = new Date().toLocaleString("default", { month: "long" });
  for (const mentor of mentors) {
    await createNotification(mentor.user.id, {
      type: "MONTHLY_REMINDER",
      title: "Monthly mentoring records due",
      message: `Please complete the mentoring records for ${monthName}.`,
    });
  }
}
