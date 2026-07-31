import { Skeleton } from '@/components/ui/skeleton'
import { useGetProposal } from '../../hooks/useGetProposal'
import SessionsList from './SessionsList'

interface BookingFlowProps {
  proposalId: string
}

const BookingFlow = ({ proposalId }: BookingFlowProps) => {
  const proposalQuery = useGetProposal(proposalId)
  if (proposalQuery.isPending) {
    return (
      <div className="rounded-3xl border border-[#E0E2E6] bg-white p-6">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  if (proposalQuery.isError) {
    return (
      <div className="rounded-3xl border border-[#E0E2E6] bg-white p-6">
        <p className="text-sm text-destructive">Couldn't load this booking.</p>
      </div>
    )
  }

  const proposal = proposalQuery.data
  const orderedSessions = [...proposal.sessions].sort((a, b) => a.sessionNumber - b.sessionNumber)

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[#E0E2E6] bg-white p-6">
      <SessionsList sessions={orderedSessions} proposal={proposal} />
    </div>
  )
}

export default BookingFlow
