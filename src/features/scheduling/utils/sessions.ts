import { CheckCircle2, Circle, Lock, type LucideIcon } from 'lucide-react'
import type { Session } from '../types/dto'
import type { SessionStatus } from '../types/enums'

const ACTIONABLE_SESSION_STATUSES: SessionStatus[] = ['PENDING_SCHEDULE', 'HELD', 'CANCELLED']

export function isSessionActionable(status: SessionStatus): boolean {
  return ACTIONABLE_SESSION_STATUSES.includes(status)
}

export function findActionableSessions(sessions: Session[]): Session[] {
  return sessions.filter((session) => isSessionActionable(session.status))
}

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  LOCKED: 'Waiting on a previous session',
  PENDING_SCHEDULE: 'Ready to schedule',
  HELD: 'Pending confirmation',
  BOOKED: 'Booked',
  PENDING_REVIEW: 'Awaiting review',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
}

export const SESSION_STATUS_ICON: Record<SessionStatus, LucideIcon> = {
  LOCKED: Lock,
  PENDING_SCHEDULE: Circle,
  HELD: Circle,
  BOOKED: CheckCircle2,
  PENDING_REVIEW: Circle,
  COMPLETED: CheckCircle2,
  CANCELLED: Circle,
  DISPUTED: Circle,
}
