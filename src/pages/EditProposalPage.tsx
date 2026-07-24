import { Skeleton } from '@/components/ui/skeleton'
import useGetMyProposal from '@/features/proposal/hooks/useGetMyProposal'
import CreateProposalForm from '@/features/proposal/components/ui/CreateProposalForm/CreateProposalForm'
import { useParams } from 'react-router-dom'

const EditProposalPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: proposal, isLoading, isError } = useGetMyProposal(id)

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    )
  }

  if (isError || !proposal) {
    return (
      <div className="rounded-3xl border border-[#E0E2E6] bg-white p-8 text-center">
        <p className="text-lg font-semibold text-[#1E293B]">This proposal couldn't be found.</p>
        <p className="mt-1 text-sm text-[#6B7280]">
          It may have been removed, or the link is incorrect.
        </p>
      </div>
    )
  }

  if (proposal.status !== 'PENDING') {
    return (
      <div className="rounded-3xl border border-[#E0E2E6] bg-white p-8 text-center">
        <p className="text-lg font-semibold text-[#1E293B]">
          This proposal can no longer be edited.
        </p>
        <p className="mt-1 text-sm text-[#6B7280]">
          Only proposals still awaiting a decision can be changed.
        </p>
      </div>
    )
  }

  return (
    <div>
      <CreateProposalForm learnrequest={proposal.learnRequest} existingProposal={proposal} />
    </div>
  )
}

export default EditProposalPage
