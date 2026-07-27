import { Skeleton } from '@/components/ui/skeleton'
import { useGetProposal } from '@/features/scheduling/hooks/useGetProposal'
import SessionsList from './SessionsList'
import { useState } from 'react'
import { Session } from '@/features/scheduling/types/dto'
import SessionRoomDetails from './SessionRoomDetails'
import NoResults from '@/components/ui/NoResults'
import EmptySelectedSession from './EmptySelectedSession'
interface SessionsTabProps {
  proposalId: string
}

const SessionsTab = ({ proposalId }: SessionsTabProps) => {
  const { data: proposal, isPending, isError } = useGetProposal(proposalId)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

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

  const selectedSession: Session | undefined = proposal.sessions?.find(
    (session: Session) => session.id === selectedSessionId
  )

  return (
    <div className="overflow-hidden rounded-3xl border border-[#E0E2E6] bg-white">
      <div className="flex flex-row">
        <div>
          <SessionsList
            proposal={proposal}
            onSelectSession={setSelectedSessionId}
            selectedSessionId={selectedSessionId}
          />
        </div>
        <div className="flex-1 p-6">
          {selectedSession ? (
            <SessionRoomDetails key={selectedSession.id} sessionId={selectedSession.id} />
          ) : (
            <EmptySelectedSession />
          )}
        </div>
      </div>
    </div>
  )
}

export default SessionsTab
