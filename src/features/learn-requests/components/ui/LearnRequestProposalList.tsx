import { Proposal } from '@/features/proposal/store/types'
import React, { Dispatch, SetStateAction } from 'react'
import LearnRequestProposalCard from './LearnRequestProposalCard'
import { LearnRequestStatus } from '../../store/types'
import useHireProposal from '@/features/proposal/hooks/useHireProposal'
import LearnRequestPagination from './LearnRequestPagination'
import { PROPOSALS_PAGE_SIZE } from '../../hooks/useGetProposalsForRequest'
import NoResults from '@/components/ui/NoResults'

type LearnRequestProposalListProps = {
  proposals: Proposal[]
  learnRequestStatus: LearnRequestStatus
  learnRequestId: string
  totalCount: number
  page: number
  setPage: Dispatch<SetStateAction<number>>
  isError?: boolean
  isLoading?: boolean
}

const LearnRequestProposalList: React.FC<LearnRequestProposalListProps> = ({
  proposals,
  learnRequestStatus,
  learnRequestId,
  totalCount,
  page,
  setPage,
  isError,
  isLoading,
}) => {
  const hireMutation = useHireProposal(learnRequestId)

  if (isLoading) return <p>...loading</p>

  if (isError || proposals.length <= 0)
    return (
      <div>
        <NoResults />
      </div>
    )
  return (
    <div className="space-y-4">
      <div className="space-y-8">
        {proposals.map((proposal) => (
          <LearnRequestProposalCard
            key={proposal.id}
            proposal={proposal}
            learnRequestStatus={learnRequestStatus}
            onHire={(proposalId) => hireMutation.mutate(proposalId)}
            isHiring={hireMutation.isPending && hireMutation.variables === proposal.id}
          />
        ))}
      </div>
      <div className="flex items-center justify-end">
        <LearnRequestPagination
          currentPage={page}
          totalCount={totalCount}
          take={PROPOSALS_PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}

export default LearnRequestProposalList
