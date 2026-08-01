import { Link } from 'react-router-dom'
import { Video } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useGetProposal } from '@/features/scheduling/learner-booking/hooks/useGetProposal'
import { SESSION_STATUS_ICON, SESSION_STATUS_LABELS } from '@/features/scheduling/utils/sessions'
import type { Session } from '@/features/scheduling/types/dto'

const JOINABLE_STATUSES: Session['status'][] = ['BOOKED', 'COMPLETED']

const STATUS_TEXT_CLASSNAMES: Record<Session['status'], string> = {
  LOCKED: 'text-gray-400',
  PENDING_SCHEDULE: 'text-gray-400',
  HELD: 'text-gray-400',
  BOOKED: 'text-emerald-600',
  COMPLETED: 'text-[#2563EB]',
  CANCELLED: 'text-gray-400',
}

interface SessionsTabProps {
  proposalId: string
}

const SessionsTab = ({ proposalId }: SessionsTabProps) => {
  const { data: proposal, isPending, isError } = useGetProposal(proposalId)

  if (isPending) {
    return (
      <div className="flex flex-col gap-3 rounded-3xl border border-[#E0E2E6] bg-white p-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (isError || !proposal) {
    return (
      <div className="rounded-3xl border border-[#E0E2E6] bg-white p-6">
        <p className="text-sm text-destructive">Couldn't load your sessions.</p>
      </div>
    )
  }

  const ordered = [...proposal.sessions].sort((a, b) => a.sessionNumber - b.sessionNumber)

  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-[#E0E2E6] bg-white p-6">
      {ordered.length === 0 && <p className="text-sm text-gray-400">No sessions yet.</p>}

      {ordered.map((session) => {
        const StatusIcon = SESSION_STATUS_ICON[session.status]
        const isJoinable = JOINABLE_STATUSES.includes(session.status)

        return (
          <div
            key={session.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-[#E0E2E6] bg-[#F9FAFB] px-5 py-3"
          >
            <span className="text-sm font-medium text-[#1E293B]">{session.title}</span>
            <div className="flex items-center gap-3">
              <span
                className={`flex items-center gap-1.5 text-xs font-medium ${STATUS_TEXT_CLASSNAMES[session.status]}`}
              >
                <StatusIcon className="size-4" />
                {SESSION_STATUS_LABELS[session.status]}
              </span>
              {isJoinable && (
                <Button asChild size="sm" variant="outline">
                  <Link to={`/sessions/${session.id}/room`}>
                    <Video className="size-3.5" />
                    Session Room
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SessionsTab
