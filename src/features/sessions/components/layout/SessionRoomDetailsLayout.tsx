import { SessionContext } from '../../hooks/useGetSessionContext'
import { MeetingDetails } from '@/features/scheduling/types/dto'
import MeetingCard from '../ui/MeetingCard'
import BackButton from '@/components/ui/BackButton'
import RescheduleSessionAction from '../ui/RescheduleSessionAction'

type SessionRoomDetailsLayoutProps = {
  children: React.ReactNode
  context: SessionContext
  meeting: MeetingDetails
  sessionId: string
  proposalId: string
}

const SessionRoomDetailsLayout = ({
  children,
  meeting,
  context,
  sessionId,
  proposalId,
}: SessionRoomDetailsLayoutProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <BackButton />
        {context.booking && (
          <RescheduleSessionAction
            sessionId={sessionId}
            proposalId={proposalId}
            bookingId={context.booking.id}
            bookingStatus={context.booking.status}
            startTime={context.booking.startTime}
          />
        )}
      </div>
      <div className="grid grid-cols-[380px_1fr] gap-6">
        <MeetingCard context={context} meeting={meeting} sessionId={sessionId} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}

export default SessionRoomDetailsLayout
