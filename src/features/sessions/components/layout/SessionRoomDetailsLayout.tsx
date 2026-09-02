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
    <div className="w-full space-y-8">
      <div className="flex w-full items-center justify-between">
        <BackButton text={'Back'} className="text-xl text-primary" />
        <div>
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
      </div>
      <div className="grid grid-cols-[380px_1fr] gap-6">
        <MeetingCard context={context} meeting={meeting} sessionId={sessionId} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}

export default SessionRoomDetailsLayout
