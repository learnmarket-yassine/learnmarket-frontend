import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/layout/ConfirmModal'
import { useCountdown } from '@/features/scheduling/hooks/useCountdown'
import { useRescheduleBooking } from '@/features/scheduling/hooks/useRescheduleBooking'
import { BookingStatus } from '@/features/scheduling/types/enums'
import { CalendarSync, CalendarX } from 'lucide-react'
import { useStore } from '@/store/store'
import { cn } from '@/lib/utils'

export const RESCHEDULE_CUTOFF_HOURS = 2

interface RescheduleSessionActionProps {
  sessionId: string
  proposalId?: string
  bookingId: string
  bookingStatus: BookingStatus
  startTime: string
  className?: string
}

const RescheduleSessionAction = ({
  sessionId,
  proposalId,
  bookingId,
  bookingStatus,
  startTime,
  className,
}: RescheduleSessionActionProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { msRemaining } = useCountdown(startTime, 'long')
  const user = useStore((state) => state.auth.user)
  const { mutateAsync: reschedule, isPending } = useRescheduleBooking(
    bookingId,
    sessionId,
    proposalId
  )

  if (bookingStatus !== 'CONFIRMED') return null

  const hoursUntilStart = msRemaining / (1000 * 60 * 60)
  const canReschedule = hoursUntilStart > RESCHEDULE_CUTOFF_HOURS

  if (!canReschedule || !user) return null

  const isTutor = user.role === 'TUTOR'

  const copy = isTutor
    ? {
        triggerLabel: 'Cancel session',
        Icon: CalendarX,
        title: 'Cancel this session?',
        description: 'The learner will need to pick a new time for this session.',
        confirmButtonText: 'Cancel session',
      }
    : {
        triggerLabel: 'Reschedule',
        Icon: CalendarSync,
        title: 'Reschedule this session?',
        description: "This will cancel your current time. You'll pick a new one right after.",
        confirmButtonText: 'Reschedule',
      }

  const { Icon } = copy

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsConfirmOpen(true)}
        className={cn(
          'flex h-full w-fit items-center gap-2 rounded-full bg-[#2563EB]/90 px-6 py-2 font-medium text-white hover:bg-[#2563EB] hover:text-white/90',
          className
        )}
      >
        <Icon />
        {copy.triggerLabel}
      </Button>
      <ConfirmModal
        name="Event Exception Modal"
        type="confirm"
        isOpen={isConfirmOpen}
        setIsOpen={(next) => setIsConfirmOpen(!!next)}
        title={copy.title}
        description={copy.description}
        handleConfirm={async () => {
          await reschedule()
          setIsConfirmOpen(false)
        }}
        isLoading={isPending}
        confirmButtonText={copy.confirmButtonText}
      />
    </>
  )
}

export default RescheduleSessionAction
