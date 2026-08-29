import type { SessionStatus } from '../types/enums'

export interface ScheduleAction {
  // null = hide the schedule/reschedule icon entirely
  enabled: boolean | null
  label: string
  disabledReason?: string
}

const SCHEDULE_ACTIONS: Record<SessionStatus, ScheduleAction> = {
  LOCKED: {
    enabled: false,
    label: 'Schedule',
    disabledReason: 'Complete the previous session first',
  },
  PENDING_SCHEDULE: { enabled: true, label: 'Schedule' },
  HELD: { enabled: true, label: 'Resume' },
  BOOKED: { enabled: true, label: 'Reschedule' },
  PENDING_REVIEW: { enabled: null, label: 'Schedule' },
  COMPLETED: { enabled: null, label: 'Schedule' },
  CANCELLED: { enabled: true, label: 'Schedule' },
  DISPUTED: { enabled: null, label: 'Schedule' },
}

export function getScheduleAction(status: SessionStatus): ScheduleAction {
  return SCHEDULE_ACTIONS[status]
}
