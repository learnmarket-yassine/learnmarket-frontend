import { useEffect, useRef, useState } from 'react'
import Daily, { DailyCall } from '@daily-co/daily-js'
import { Button } from '@/components/ui/button'
import { RefreshCw, Video } from 'lucide-react'
import useRetryMeeting from '../../hooks/useRetryMeeting'
import { useCountdown } from '@/features/scheduling/hooks/useCountdown'
import { MeetingDetails } from '@/features/scheduling/types/dto'
import { SessionContext } from '../../hooks/useGetSessionContext'

interface SessionVideoCardProps {
  meeting: MeetingDetails
  sessionId: string
  context: SessionContext
}

const SessionVideoCard = ({ meeting, sessionId, context }: SessionVideoCardProps) => {
  const { handleRetryMeeting, isPending: isRetrying } = useRetryMeeting(sessionId)
  const [isCallActive, setIsCallActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const callFrameRef = useRef<DailyCall | null>(null)

  const canJoinYet = meeting?.canJoinYet ?? false

  const countdown = useCountdown(canJoinYet ? null : (context?.booking?.startTime ?? null), 'long')

  // Embeds Daily's prebuilt call UI in place, rather than opening the
  // meeting in a separate tab. Only mounted once the learner/tutor
  // explicitly clicks "Join Session" -- never auto-joins on render, so a
  // camera/mic permission prompt is always the result of a deliberate click.
  useEffect(() => {
    if (!isCallActive || meeting.status !== 'provisioned' || !containerRef.current) return

    const callFrame = Daily.createFrame(containerRef.current, {
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: '0',
        borderRadius: '1rem',
      },
      showLeaveButton: true,
    })
    callFrameRef.current = callFrame

    callFrame.on('left-meeting', () => setIsCallActive(false))
    callFrame.join({ url: meeting.joinUrl })

    return () => {
      callFrame.destroy()
      callFrameRef.current = null
    }
    // meeting.joinUrl is intentionally excluded -- it's a short-lived token
    // that may get re-minted by a background refetch while the call is
    // already active, and rejoining mid-call would disrupt the session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCallActive, meeting.status])

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

        {meeting.status === 'provisioned' && isCallActive && (
          <div
            ref={containerRef}
            className="h-[560px] w-full overflow-hidden rounded-2xl bg-black"
          />
        )}

        {meeting.status === 'provisioned' && !isCallActive && (
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-100">Session starts in</p>

              <p className="mt-1 text-3xl font-bold">
                {canJoinYet ? 'Ready to join' : countdown.formatted}
              </p>
            </div>
            <Button
              className="h-12 rounded-xl bg-white px-6 font-semibold text-[#2563EB] shadow-lg transition hover:bg-slate-100 disabled:opacity-60"
              disabled={!canJoinYet}
              onClick={() => setIsCallActive(true)}
            >
              <Video className="mr-2 size-5" />
              Join Session
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionVideoCard
