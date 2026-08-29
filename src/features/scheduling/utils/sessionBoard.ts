import { CalendarClock, CheckCircle2, Lock, type LucideIcon } from 'lucide-react'
import type { Session } from '../types/dto'
import type { SessionStatus } from '../types/enums'

export const SESSIONS_PER_PAGE = 6

export type SessionBoardBucket = 'completed' | 'ready' | 'not-ready'

const BUCKET_BY_STATUS: Record<SessionStatus, SessionBoardBucket> = {
  COMPLETED: 'completed',
  PENDING_SCHEDULE: 'ready',
  HELD: 'ready',
  LOCKED: 'not-ready',
  BOOKED: 'not-ready',
  PENDING_REVIEW: 'not-ready',
  CANCELLED: 'not-ready',
  DISPUTED: 'not-ready',
}

export function getSessionBoardBucket(status: SessionStatus): SessionBoardBucket {
  return BUCKET_BY_STATUS[status]
}

export const SESSION_BOARD_STYLES: Record<
  SessionBoardBucket,
  { pillClassName: string; icon: LucideIcon; segmentClassName: string; legendLabel: string }
> = {
  completed: {
    pillClassName: 'bg-emerald-50 text-emerald-700',
    icon: CheckCircle2,
    segmentClassName: 'bg-emerald-500',
    legendLabel: 'Completed',
  },
  ready: {
    pillClassName: 'bg-blue-50 text-[#2563EB]',
    icon: CalendarClock,
    segmentClassName: 'bg-[#2563EB]',
    legendLabel: 'Ready to schedule',
  },
  'not-ready': {
    pillClassName: 'bg-gray-100 text-gray-500',
    icon: Lock,
    segmentClassName: 'bg-gray-300',
    legendLabel: 'Not ready',
  },
}

export function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function findFirstActionablePageIndex(sessions: Session[], pageSize: number): number {
  const index = sessions.findIndex((session) => getSessionBoardBucket(session.status) === 'ready')
  return index === -1 ? 0 : Math.floor(index / pageSize)
}
