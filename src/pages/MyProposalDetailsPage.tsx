import { Link, useNavigate, useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import useGetMyProposal from '@/features/proposal/hooks/useGetMyProposal'
import ProposalLearnRequestContextCard from '@/features/proposal/components/ui/ProposalLearnRequestContextCard'
import CoverLetterSection from '@/features/proposal/components/ui/ProposalCoverLetterSection'
import WithdrawProposalAction from '@/features/proposal/components/ui/WithdrawProposalAction'
import { Button } from '@/components/ui/button'
import ProposalSessionsSection from '@/features/proposal/components/ui/ProposalSessionsSection'

const MyProposalDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: proposal, isLoading, isError } = useGetMyProposal(id)

  if (isLoading) {
    return (
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-9 space-y-6">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
        <div className="col-span-3 space-y-3">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    )
  }

  if (isError || !proposal) {
    return (
      <div className="space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-8 text-center">
        <p className="text-lg font-semibold text-[#1E293B]">This proposal couldn't be found.</p>
        <p className="text-sm text-[#6B7280]">
          It may have been removed, or the link is incorrect.
        </p>
        <Link
          to="/proposals"
          className="inline-block text-sm font-semibold text-[#2563EB] underline underline-offset-2"
        >
          Back to My Proposals
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-9 space-y-6">
        <ProposalLearnRequestContextCard proposal={proposal} />
        <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
          <ProposalSessionsSection sessions={proposal.sessionPlans} />
        </div>
        {proposal.message && (
          <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
            <CoverLetterSection message={proposal.message} />
          </div>
        )}
      </div>
      <div className="col-span-3 space-y-6">
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            disabled={proposal.status !== 'PENDING'}
            onClick={() => navigate(`/proposals/${proposal.id}/edit`)}
            className="w-full whitespace-nowrap rounded-full bg-[#2563EB] py-6 font-medium text-white hover:bg-[#2563EB] disabled:cursor-not-allowed"
          >
            Edit proposal
          </Button>
          <WithdrawProposalAction proposalId={proposal.id} status={proposal.status} />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">About the Learner</h2>
          <div>
            <h4 className="text-base font-semibold">{proposal.learnRequest.learner?.country}</h4>
            <h4>{proposal.learnRequest.learner?.city}</h4>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProposalDetailsPage
