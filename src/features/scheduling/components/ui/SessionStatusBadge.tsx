import { cn } from '@/lib/utils'
import type { SessionStatus } from '../../types/enums'
import { SESSION_STATUS_LABELS } from '../../utils/sessions'
import { formatDateLabel, formatSlotTime } from '../../utils/time'
import { getBrowserTimezone } from '../../utils/timezones'

const STATUS_CLASSNAMES: Record<SessionStatus, string> = {
  LOCKED: 'bg-gray-100 text-gray-500',
  PENDING_SCHEDULE: 'bg-gray-100 text-gray-500',
  HELD: 'bg-gray-100 text-gray-500',
  BOOKED: 'bg-emerald-50 text-emerald-700',
  PENDING_REVIEW: 'bg-amber-50 text-amber-700',
  COMPLETED: 'bg-blue-50 text-[#2563EB]',
  CANCELLED: 'bg-gray-100 text-gray-500',
  DISPUTED: 'bg-red-100 text-red-700',
}

interface SessionStatusBadgeProps {
  status: SessionStatus
  booking?: { startTime: string } | null
  className?: string
}

const SessionStatusBadge = ({ status, booking, className }: SessionStatusBadgeProps) => {
  const label =
    status === 'BOOKED' && booking
      ? (() => {
          const timezone = getBrowserTimezone()
          return `Booked ${formatDateLabel(booking.startTime, timezone)}, ${formatSlotTime(booking.startTime, timezone)}`
        })()
      : SESSION_STATUS_LABELS[status]

  return (
    <span
      className={cn(
        'w-fit whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold',
        STATUS_CLASSNAMES[status],
        className
      )}
    >
      {label}
    </span>
  )
}

export default SessionStatusBadge
