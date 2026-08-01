import { SessionContext } from '../../hooks/useGetSessionContext'
import { MeetingDetails } from '@/features/scheduling/types/dto'
import MeetingCard from '../ui/MeetingCard'
import BackButton from '@/components/ui/BackButton'

type SessionRoomDetailsLayoutProps = {
  children: React.ReactNode
  context: SessionContext
  meeting: MeetingDetails
  sessionId: string
}

const SessionRoomDetailsLayout = ({
  children,
  meeting,
  context,
  sessionId,
}: SessionRoomDetailsLayoutProps) => {
  return (
    <div className="space-y-8">
      <BackButton />
      <div className="grid grid-cols-[380px_1fr] gap-6">
        <MeetingCard context={context} meeting={meeting} sessionId={sessionId} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}

export default SessionRoomDetailsLayout
