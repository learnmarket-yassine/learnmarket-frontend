import { useEffect } from 'react'
import { RefreshCw, Users, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCountdown } from '../../scheduling/hooks/useCountdown'
import { formatDateLabel, formatSlotTime } from '../../scheduling/utils/time'
import { getBrowserTimezone } from '../../scheduling/utils/timezones'
import useGetSessionContext from '../hooks/useGetSessionContext'
import useGetMeetingDetails from '../hooks/useGetMeetingDetails'
import useRetryMeeting from '../hooks/useRetryMeeting'
import useJoinSession from '../hooks/useJoinSession'
import { useSessionSocketConnection } from '../hooks/useSessionSocketConnection'
import { useSessionRoomSocket } from '../hooks/useSessionRoomSocket'
import SessionAttachments from './SessionAttachments'

interface SessionRoomProps {
  sessionId: string
}

const SessionRoom = ({ sessionId }: SessionRoomProps) => {
  useSessionSocketConnection()
  const { data: context, isLoading: isContextLoading } = useGetSessionContext(sessionId)
  const { data: meeting, isLoading: isMeetingLoading } = useGetMeetingDetails(sessionId)
  const { handleRetryMeeting, isPending: isRetrying } = useRetryMeeting(sessionId)
  const { handleJoinSession, hasFired } = useJoinSession(sessionId)
  const { lastJoined } = useSessionRoomSocket(sessionId)

  const timezone = getBrowserTimezone()
  const canJoinYet = meeting?.canJoinYet ?? false
  const countdown = useCountdown(canJoinYet ? null : (context?.booking?.startTime ?? null))

  useEffect(() => {
    if (canJoinYet && !hasFired) {
      handleJoinSession()
    }
  }, [canJoinYet, hasFired, handleJoinSession])

  if (isContextLoading || isMeetingLoading || !context || !meeting) {
    return <div className="p-6 text-sm text-gray-500">Loading session…</div>
  }

  const tutorJoined = lastJoined?.role === 'TUTOR' || !!context.tutorJoinedAt
  const learnerJoined = lastJoined?.role === 'LEARNER' || !!context.learnerJoinedAt

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-[#1E293B]">{context.title}</h2>
        {context.objective && <p className="text-sm text-gray-500">{context.objective}</p>}
        {context.booking && (
          <p className="text-sm text-gray-500">
            {formatDateLabel(context.booking.startTime, timezone)} ·{' '}
            {formatSlotTime(context.booking.startTime, timezone)} –{' '}
            {formatSlotTime(context.booking.endTime, timezone)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
        <Users className="size-4" />
        <span className={tutorJoined ? 'text-emerald-600' : undefined}>
          Tutor {tutorJoined ? 'has joined' : 'not joined yet'}
        </span>
        <span>·</span>
        <span className={learnerJoined ? 'text-emerald-600' : undefined}>
          Learner {learnerJoined ? 'has joined' : 'not joined yet'}
        </span>
      </div>

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

      <SessionAttachments sessionId={sessionId} />
    </div>
  )
}

export default SessionRoom
