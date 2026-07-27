import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Video } from 'lucide-react'
import useRetryMeeting from '../../hooks/useRetryMeeting'
import useJoinSession from '../../hooks/useJoinSession'
import { useCountdown } from '@/features/scheduling/hooks/useCountdown'
import { MeetingDetails } from '@/features/scheduling/types/dto'
import { SessionContext } from '../../hooks/useGetSessionContext'

interface SessionZoomProps {
  meeting: MeetingDetails
  sessionId: string
  context: SessionContext
}

const SessionZoom = ({ meeting, sessionId, context }: SessionZoomProps) => {
  const { handleRetryMeeting, isPending: isRetrying } = useRetryMeeting(sessionId)
  const { handleJoinSession, hasFired } = useJoinSession(sessionId)

  const canJoinYet = meeting?.canJoinYet ?? false

  const countdown = useCountdown(canJoinYet ? null : (context?.booking?.startTime ?? null), 'long')

  useEffect(() => {
    if (canJoinYet && !hasFired) {
      handleJoinSession()
    }
  }, [canJoinYet, hasFired, handleJoinSession])

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F3D91] via-[#2563EB] to-[#60A5FA] p-8 text-white shadow-2xl">
      {/* Decorative glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

      {/* Decorative rings */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full border border-white" />
        <div className="absolute -right-12 -top-12 h-[26rem] w-[26rem] rounded-full border border-white" />
      </div>

      <div className="relative flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Video className="size-7" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Video Session</h2>
            <p className="text-sm text-blue-100">
              Meet live with your {context.isTutor ? 'learner' : 'tutor'}.
            </p>
          </div>
        </div>

        {meeting.status === 'not_provisioned' && (
          <div className="flex flex-col gap-5">
            <p className="text-blue-50">
              We're preparing your video meeting. This usually takes just a few seconds.
            </p>

            {context.isTutor && (
              <Button
                variant="secondary"
                className="w-fit bg-white text-[#2563EB] hover:bg-slate-100"
                onClick={() => handleRetryMeeting()}
                disabled={isRetrying}
              >
                <RefreshCw className={`mr-2 size-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying…' : 'Retry setup'}
              </Button>
            )}
          </div>
        )}

        {meeting.status === 'provisioned' && (
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-100">Session starts in</p>

              <p className="mt-1 text-3xl font-bold">
                {canJoinYet ? 'Ready to join' : countdown.formatted}
              </p>
            </div>
            {canJoinYet ? (
              <Button
                asChild
                className="h-12 rounded-xl bg-white px-6 font-semibold text-[#2563EB] shadow-lg transition hover:bg-slate-100"
              >
                <a href={meeting.joinUrl} target="_blank" rel="noopener noreferrer">
                  <Video className="mr-2 size-5" />
                  Join Session
                </a>
              </Button>
            ) : (
              <Button
                disabled
                className="h-12 rounded-xl bg-white px-6 font-semibold text-[#2563EB] opacity-60 shadow-lg"
              >
                <Video className="mr-2 size-5" />
                Join Session
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionZoom
