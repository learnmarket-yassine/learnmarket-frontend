import { CalendarIcon, Clock } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import RescheduleSessionAction, {
  RESCHEDULE_CUTOFF_HOURS,
} from '@/features/sessions/components/ui/RescheduleSessionAction'
import useGetSessionContext from '@/features/sessions/hooks/useGetSessionContext'
import { useCountdown } from '../../hooks/useCountdown'
import type { Session } from '../../types/dto'
import type { BookingStatus } from '../../types/enums'
import { formatDateLabel, formatSlotTime } from '../../utils/time'
import { getBrowserTimezone } from '../../utils/timezones'

interface RescheduleSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: Session
}

const RescheduleSessionModal = ({ open, onOpenChange, session }: RescheduleSessionModalProps) => {
  const { data: context, isLoading } = useGetSessionContext(session.id, open)
  const timezone = getBrowserTimezone()
  const booking = context?.booking

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[480px] flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#143681]">{session.title}</DialogTitle>
        </DialogHeader>

        {isLoading || !booking ? (
          <Skeleton className="h-24 w-full rounded-2xl" />
        ) : (
          <>
            <div className="flex flex-col gap-2 rounded-2xl border border-[#E0E2E6] bg-[#F9FAFB] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[#1E293B]">
                <CalendarIcon className="size-4 text-[#2563EB]" />
                {formatDateLabel(booking.startTime, timezone)}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#565A60]">
                <Clock className="size-4 text-[#2563EB]" />
                {formatSlotTime(booking.startTime, timezone)} –{' '}
                {formatSlotTime(booking.endTime, timezone)}
              </div>
            </div>

            <CutoffAwareAction
              sessionId={session.id}
              proposalId={session.proposalId}
              bookingId={booking.id}
              bookingStatus={booking.status}
              startTime={booking.startTime}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// RescheduleSessionAction silently renders null once inside the 2-hour
// cutoff -- surface why, rather than leaving the modal looking empty.
// Uses the same RESCHEDULE_CUTOFF_HOURS threshold, for messaging only; the
// mutation/confirm logic itself lives entirely in RescheduleSessionAction.
const CutoffAwareAction = ({
  sessionId,
  proposalId,
  bookingId,
  bookingStatus,
  startTime,
}: {
  sessionId: string
  proposalId: string
  bookingId: string
  bookingStatus: BookingStatus
  startTime: string
}) => {
  const { msRemaining } = useCountdown(startTime, 'long')
  const hoursUntilStart = msRemaining / (1000 * 60 * 60)

  if (bookingStatus === 'CONFIRMED' && hoursUntilStart <= RESCHEDULE_CUTOFF_HOURS) {
    return (
      <p className="text-sm text-[#6B7280]">
        Too close to the start time to reschedule (within {RESCHEDULE_CUTOFF_HOURS} hours).
      </p>
    )
  }

  return (
    <RescheduleSessionAction
      sessionId={sessionId}
      proposalId={proposalId}
      bookingId={bookingId}
      bookingStatus={bookingStatus}
      startTime={startTime}
    />
  )
}

export default RescheduleSessionModal
