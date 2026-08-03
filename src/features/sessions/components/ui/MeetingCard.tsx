import { AlertCircle, CalendarIcon, Clock, RefreshCw, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useRetryMeeting from '../../hooks/useRetryMeeting'
import { useCountdown } from '@/features/scheduling/hooks/useCountdown'
import { formatDateLabel, formatSlotTime } from '@/features/scheduling/utils/time'
import { getBrowserTimezone } from '@/features/scheduling/utils/timezones'
import { MeetingDetails } from '@/features/scheduling/types/dto'
import { SessionContext } from '../../hooks/useGetSessionContext'
import MeetingImage from '@/assets/images/meeting-image.jpg'
import { SESSION_STATUS_CONFIG } from '@/lib/Constants'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAssetUrl } from '@/lib/utils'

interface SessionVideoCardProps {
  meeting: MeetingDetails
  sessionId: string
  context: SessionContext
}

export interface SessionStatusConfig {
  label: string
  badgeBg: string
  badgeText: string
}

const MeetingCard = ({ meeting, sessionId, context }: SessionVideoCardProps) => {
  const { handleRetryMeeting, isPending: isRetrying } = useRetryMeeting(sessionId)
  const timezone = getBrowserTimezone()
  const counterpartName = context.isTutor
    ? `${context.learner?.firstname} ${context.learner?.lastname}`
    : `${context.tutor?.firstname} ${context.tutor?.lastname}`
  const counterpartAvatar = context.isTutor ? context.learner?.avatar : context.tutor.avatar
  const counterpartInitials = counterpartName
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const canJoinYet = meeting?.canJoinYet ?? false
  const endedAt = context.booking
    ? new Date(new Date(context.booking.endTime).getTime() + 30 * 60_000).toISOString()
    : null
  const hasEnded = useCountdown(endedAt, 'long').isExpired
  const countdown = useCountdown(canJoinYet ? null : (context?.booking?.startTime ?? null), 'long')
  const statusConfig = SESSION_STATUS_CONFIG[context.status]
  const setupNeverProvisioned = meeting.status === 'not_provisioned'

  return (
    <div className="flex h-fit flex-col gap-4 rounded-3xl border border-[#E0E2E6] bg-white p-3">
      <div>
        <img className="rounded-lg" src={MeetingImage} alt="meeting image" />
      </div>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">{context.title}</h2>
            {statusConfig && (
              <span
                className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.badgeBg} ${statusConfig.badgeText}`}
              >
                {statusConfig.label}
              </span>
            )}
          </div>

          {counterpartName && (
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage src={getAssetUrl(counterpartAvatar)} alt={counterpartName} />
                <AvatarFallback className="bg-[#2563EB] text-xs font-semibold text-white">
                  {counterpartInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <span className="text-[#6B7280]">{context.isTutor ? 'Learner' : 'Tutor'}: </span>
                <span className="font-medium text-[#1E293B]">{counterpartName}</span>
              </div>
            </div>
          )}

          {context.booking && (
            <div className="flex gap-2 rounded-2xl bg-[#F9FAFB] text-base">
              <div className="flex items-center gap-2 text-[#2563EB]">
                <CalendarIcon className="size-4 text-[#2563EB]" />
                {formatDateLabel(context.booking.startTime, timezone)}
              </div>
              <div className="flex items-center gap-2 text-[#2563EB]">
                <Clock className="size-4 text-[#2563EB]" />
                {formatSlotTime(context.booking.startTime, timezone)} –{' '}
                {formatSlotTime(context.booking.endTime, timezone)}
              </div>
            </div>
          )}
          <p className="text-base font-medium text-slate-600">{context.objective}</p>
        </div>
        {hasEnded ? (
          <div className="flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>
              this video session has ended. If you have any issues, please contact support for
              assistance.
            </span>
          </div>
        ) : setupNeverProvisioned ? (
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            <div className="flex items-start gap-3">
              <RefreshCw className="mt-0.5 size-4 shrink-0" />

              <div className="space-y-1">
                <p className="font-medium">Preparing your video meeting</p>
                <p className="text-blue-600">
                  We're setting up your video meeting. This usually takes only a few seconds. Please
                  wait while we prepare everything.
                </p>
              </div>
            </div>

            {context.isTutor && (
              <Button
                type="button"
                variant="outline"
                className="shrink-0 rounded-full border-blue-200 bg-white text-blue-700 hover:bg-blue-100"
                onClick={() => {
                  handleRetryMeeting()
                }}
                disabled={isRetrying}
              >
                <RefreshCw className={`mr-2 size-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying…' : 'Try again'}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {!canJoinYet && (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm text-[#6B7280]">
                <Clock className="size-4" />
                <span>Available in {countdown.formatted}</span>
              </div>
            )}

            {canJoinYet ? (
              <a
                href={meeting.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] font-semibold text-white transition hover:bg-[#1D4FD8]"
              >
                <Video className="size-4" />
                Join meeting
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#F1F5F9] font-semibold text-[#94A3B8]"
              >
                <Video className="size-4" />
                Join meeting
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MeetingCard
