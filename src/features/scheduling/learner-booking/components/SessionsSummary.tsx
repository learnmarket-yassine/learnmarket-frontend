import type { Session } from '../../types/dto'
import { SESSION_STATUS_ICON, SESSION_STATUS_LABELS } from '../../utils/sessions'

const STATUS_TEXT_CLASSNAMES: Record<Session['status'], string> = {
  LOCKED: 'text-gray-400',
  PENDING_SCHEDULE: 'text-gray-400',
  HELD: 'text-gray-400',
  BOOKED: 'text-emerald-600',
  COMPLETED: 'text-[#2563EB]',
  CANCELLED: 'text-gray-400',
}

interface SessionsSummaryProps {
  sessions: Session[]
}

const SessionsSummary = ({ sessions }: SessionsSummaryProps) => {
  const ordered = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber)

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm font-semibold text-[#1E293B]">
        There's nothing left to schedule right now
      </p>
      <div className="flex flex-col gap-2">
        {ordered.map((session) => {
          const StatusIcon = SESSION_STATUS_ICON[session.status]
          return (
            <div
              key={session.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-[#E0E2E6] bg-[#F9FAFB] px-5 py-3"
            >
              <span className="text-sm font-medium text-[#1E293B]">{session.title}</span>
              <span
                className={`flex items-center gap-1.5 text-xs font-medium ${STATUS_TEXT_CLASSNAMES[session.status]}`}
              >
                <StatusIcon className="size-4" />
                {SESSION_STATUS_LABELS[session.status]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SessionsSummary
