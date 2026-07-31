import { useState } from 'react'
import { CalendarClock, ClipboardCheck, Eye } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import useGetSessionContext from '@/features/sessions/hooks/useGetSessionContext'
import { cn } from '@/lib/utils'
import type { Session } from '../../types/dto'
import { getScheduleAction } from '../../utils/scheduleAction'
import SessionStatusBadge from './SessionStatusBadge'
import ViewSessionModal from './ViewSessionModal'
import RescheduleSessionModal from './RescheduleSessionModal'
import RespondSessionModal from './RespondSessionModal'

interface SessionCardProps {
  session: Session
  isActive: boolean
  onSchedule: () => void
}

const SessionCard = ({ session, isActive, onSchedule }: SessionCardProps) => {
  const [viewOpen, setViewOpen] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [respondOpen, setRespondOpen] = useState(false)

  const isBooked = session.status === 'BOOKED'
  const { data: context } = useGetSessionContext(session.id, isBooked)
  const action = getScheduleAction(session.status)

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-2xl border border-[#E0E2E6] bg-white p-4',
        isActive && 'ring-2 ring-[#2563EB]'
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-[#1E293B]">{session.title}</span>
        <SessionStatusBadge status={session.status} booking={isBooked ? context?.booking : null} />
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          icon={<Eye className="size-4" />}
          label="View details"
          onClick={() => setViewOpen(true)}
        />

        {session.status === 'PENDING_REVIEW' ? (
          <IconButton
            icon={<ClipboardCheck className="size-4" />}
            label="Respond"
            onClick={() => setRespondOpen(true)}
          />
        ) : (
          action.enabled !== null && (
            <IconButton
              icon={<CalendarClock className="size-4" />}
              label={action.label}
              disabled={!action.enabled}
              disabledReason={action.disabledReason}
              onClick={() => (isBooked ? setRescheduleOpen(true) : onSchedule())}
            />
          )
        )}
      </div>

      <ViewSessionModal open={viewOpen} onOpenChange={setViewOpen} session={session} />

      {isBooked && (
        <RescheduleSessionModal
          open={rescheduleOpen}
          onOpenChange={setRescheduleOpen}
          session={session}
        />
      )}

      {session.status === 'PENDING_REVIEW' && (
        <RespondSessionModal open={respondOpen} onOpenChange={setRespondOpen} session={session} />
      )}
    </div>
  )
}

export default SessionCard
