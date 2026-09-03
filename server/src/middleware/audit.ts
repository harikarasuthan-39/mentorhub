import { Request } from "express";
import { prisma } from "../config/prisma";

export async function logAudit(
  req: Request,
  action: string,
  entity: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId,
        action,
        entity,
        entityId,
        metadata: (metadata as any) ?? undefined,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });
  } catch (err) {
    // Audit logging must never break the primary request flow.
    console.error("Failed to write audit log:", err);
  }
}
