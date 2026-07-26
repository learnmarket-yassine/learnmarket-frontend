import { Proposal } from '@/features/scheduling/types/dto'
import SessionCard from './SessionCard'

interface SessionsListProps {
  proposal: Proposal
  selectedSessionId: string | null
  onSelectSession: (id: string) => void
}

const SessionsList: React.FC<SessionsListProps> = ({
  proposal,
  selectedSessionId,
  onSelectSession,
}) => {
  const ordered = [...proposal.sessions].sort((a, b) => a.sessionNumber - b.sessionNumber)

  if (ordered.length === 0) {
    return <p className="text-sm text-gray-400">No sessions yet.</p>
  }

  return (
    <div className="space-y-6 bg-white p-6">
      <h1 className="text-xl font-bold">Courses List</h1>
      <div className="flex flex-col gap-4">
        {ordered.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onSelectSession={onSelectSession}
            selectedSessionId={selectedSessionId}
          />
        ))}
      </div>
    </div>
  )
}

export default SessionsList
