import { cn } from '@/lib/utils'
import { Session } from '@/features/scheduling/types/dto'
import { SESSION_STATUS_ICON, SESSION_STATUS_LABELS } from '@/features/scheduling/utils/sessions'

type SessionCardProps = {
  session: Session
  selectedSessionId: string | null
  onSelectSession: (id: string) => void
}

const JOINABLE_STATUSES: Session['status'][] = ['BOOKED', 'COMPLETED']

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onSelectSession,
  selectedSessionId,
}) => {
  const StatusIcon = SESSION_STATUS_ICON[session.status]
  const isJoinable = JOINABLE_STATUSES.includes(session.status)
  const isSelected = session.id === selectedSessionId
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-sm border px-10 py-4 transition-colors',
        isJoinable
          ? 'cursor-pointer border-[#1a46a7] bg-white text-[#1a46a7] hover:bg-[#1a46a7] hover:text-white'
          : 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400',
        isJoinable && isSelected && 'bg-[#1a46a7] text-white'
      )}
      onClick={() => {
        if (isJoinable) {
          onSelectSession(session.id)
        }
      }}
    >
      <span className="text-sm font-medium">{session.title}</span>

      <span className="flex items-center gap-1.5 text-xs font-medium">
        <StatusIcon className="size-4" />
        {SESSION_STATUS_LABELS[session.status]}
      </span>
    </div>
  )
}

export default SessionCard
