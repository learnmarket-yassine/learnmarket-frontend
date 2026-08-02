import { CalendarIcon, Clock, RefreshCw, Video, VideoOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useRetryMeeting from '../../hooks/useRetryMeeting'
import { useCountdown } from '@/features/scheduling/hooks/useCountdown'
import { formatDateLabel, formatSlotTime } from '@/features/scheduling/utils/time'
import { getBrowserTimezone } from '@/features/scheduling/utils/timezones'
import { MeetingDetails } from '@/features/scheduling/types/dto'
import { SessionContext } from '../../hooks/useGetSessionContext'

interface SessionVideoCardProps {
  meeting: MeetingDetails
  sessionId: string
  context: SessionContext
}

const SessionVideoCard = ({ meeting, sessionId, context }: SessionVideoCardProps) => {
  const { handleRetryMeeting, isPending: isRetrying } = useRetryMeeting(sessionId)
  const timezone = getBrowserTimezone()
  const canJoinYet = meeting?.canJoinYet ?? false
  const endedAt = context.booking
    ? new Date(new Date(context.booking.endTime).getTime() + 30 * 60_000).toISOString()
    : null
  const hasEnded = useCountdown(endedAt, 'long').isExpired
  const countdown = useCountdown(canJoinYet ? null : (context?.booking?.startTime ?? null), 'long')

  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl border border-[#E0E2E6] bg-white p-6">
      <div className="flex items-center gap-2 text-[#6B7280]">
        <Video className="size-4" />
        <h2 className="text-sm font-semibold uppercase tracking-wide">Video session</h2>
      </div>
      <div className="flex items-center gap-3">
        <div>
          <p className="text-base font-semibold text-[#1E293B]">
            {context.tutor.firstname} {context.tutor.lastname}
          </p>
          <p className="text-sm text-[#6B7280]">
            {context.learner
              ? `${context.learner.firstname} ${context.learner.lastname}`
              : context.isTutor
                ? 'Learner'
                : 'Tutor'}
          </p>
        </div>
      </div>

      {context.booking && (
        <div className="flex flex-col gap-2 rounded-2xl bg-[#F9FAFB] p-4 text-sm">
          <div className="flex items-center gap-2 text-[#1E293B]">
            <CalendarIcon className="size-4 text-[#2563EB]" />
            {formatDateLabel(context.booking.startTime, timezone)}
          </div>
          <div className="flex items-center gap-2 text-[#1E293B]">
            <Clock className="size-4 text-[#2563EB]" />
            {formatSlotTime(context.booking.startTime, timezone)} –{' '}
            {formatSlotTime(context.booking.endTime, timezone)}
          </div>
        </div>
      )}

      {hasEnded ? (
        <div className="flex items-center justify-end gap-2 rounded-2xl bg-[#F3F4F6] p-4 text-sm text-[#6B7280]">
          <VideoOff className="size-4" />
          This video session has ended.
        </div>
      ) : meeting.status === 'not_provisioned' ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[#6B7280]">
            We're preparing your video meeting. This usually takes just a few seconds.
          </p>
          {context.isTutor && (
            <Button
              type="button"
              variant="outline"
              className="w-fit rounded-full"
              onClick={() => handleRetryMeeting()}
              disabled={isRetrying}
            >
              <RefreshCw className={`mr-2 size-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying…' : 'Retry setup'}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {!canJoinYet && (
            <p className="text-sm text-[#6B7280]">Session starts in {countdown.formatted}</p>
          )}
          {canJoinYet ? (
            <a
              href={meeting.joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] font-semibold text-white transition hover:bg-[#1d4fd8]"
            >
              <Video className="size-4" />
              Join meeting
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#E5E7EB] font-semibold text-[#9CA3AF]"
            >
              <Video className="size-4" />
              Join meeting
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default SessionVideoCard
