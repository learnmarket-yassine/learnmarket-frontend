import { useEffect } from 'react'
import useRetryMeeting from '../../hooks/useRetryMeeting'
import useJoinSession from '../../hooks/useJoinSession'
import { useCountdown } from '@/features/scheduling/hooks/useCountdown'
import { MeetingDetails } from '@/features/scheduling/types/dto'
import { SessionContext } from '../../hooks/useGetSessionContext'
import { Button } from '@/components/ui/button'
import { RefreshCw, Video } from 'lucide-react'

interface SessionZoomProps {
  meeting: MeetingDetails
  sessionId: string
  context: SessionContext
}

const SessionZoom = ({ meeting, sessionId, context }: SessionZoomProps) => {
  const { handleRetryMeeting, isPending: isRetrying } = useRetryMeeting(sessionId)
  const { handleJoinSession, hasFired } = useJoinSession(sessionId)
  const canJoinYet = meeting?.canJoinYet ?? false
  const countdown = useCountdown(canJoinYet ? null : (context?.booking?.startTime ?? null))

  useEffect(() => {
    if (canJoinYet && !hasFired) {
      handleJoinSession()
    }
  }, [canJoinYet, hasFired, handleJoinSession])
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#E0E2E6] bg-[#F9FAFB] p-8">
      {meeting.status === 'not_provisioned' && (
        <>
          <p className="text-sm text-gray-600">Setting up your video call…</p>
          {context.isTutor && (
            <Button variant="outline" onClick={() => handleRetryMeeting()} disabled={isRetrying}>
              <RefreshCw className="size-4" />
              {isRetrying ? 'Retrying…' : 'Retry'}
            </Button>
          )}
        </>
      )}

      {meeting.status === 'provisioned' && !meeting.canJoinYet && (
        <p className="text-sm text-gray-600">
          Your session starts in <span className="font-medium">{countdown.formatted}</span>
        </p>
      )}

      {meeting.status === 'provisioned' && meeting.canJoinYet && (
        <Button asChild>
          <a href={meeting.joinUrl} target="_blank" rel="noopener noreferrer">
            <Video className="size-4" />
            Join Session
          </a>
        </Button>
      )}
    </div>
  )
}

export default SessionZoom
