import { AuditEvent, UserRole } from "@/types";

class AuditLogger {
  private events: AuditEvent[] = [];

  log(params: {
    actorId?: string;
    actorRole?: UserRole;
    action: string;
    entityType: string;
    entityId: string;
    modelVersion?: string;
    datasetVersion?: string;
    metadata?: Record<string, unknown>;
  }): AuditEvent {
    const event: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      actorId: params.actorId || "policymaker-01",
      actorRole: params.actorRole || "POLICYMAKER",
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      timestamp: new Date().toISOString(),
      modelVersion: params.modelVersion || "v1.0.0",
      datasetVersion: params.datasetVersion || "2026-Q3-SEED",
      metadata: params.metadata,
    };

    this.events.unshift(event);
    if (this.events.length > 500) {
      this.events.pop();
    }

    console.log(`[AUDIT] ${event.actorRole}:${event.actorId} -> ${event.action} (${event.entityType}:${event.entityId})`);
    return event;
  }

  getEvents(limit: number = 50): AuditEvent[] {
    return this.events.slice(0, limit);
  }

  clear(): void {
    this.events = [];
  }
}

export const auditLogger = new AuditLogger();
