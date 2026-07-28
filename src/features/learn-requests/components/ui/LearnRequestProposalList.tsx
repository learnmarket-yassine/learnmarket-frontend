import { Proposal } from '@/features/proposal/store/types'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import LearnRequestProposalCard from './LearnRequestProposalCard'
import { LearnRequestStatus } from '../../store/types'
import useHireProposal from '@/features/proposal/hooks/useHireProposal'
import LearnRequestPagination from './LearnRequestPagination'
import { PROPOSALS_PAGE_SIZE } from '../../hooks/useGetProposalsForRequest'
import ProposalDetailsSheet from '@/features/proposal/components/ui/ProposalDetailsSheet'
import ProposalCardSkeleton from './ProposalCardSkeleton'
import { Button } from '@/components/ui/button'
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
  hasSearch?: boolean
  onRetry?: () => void
  emptyMessage?: string
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
  onRetry,
  emptyMessage,
}) => {
  const hireMutation = useHireProposal(learnRequestId)
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const selectedProposal = proposals.find((p) => p.id === selectedProposalId) ?? null

  useEffect(() => {
    if (selectedProposalId && !selectedProposal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSheetOpen(false)
    }
  }, [selectedProposalId, selectedProposal])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <ProposalCardSkeleton />
        <ProposalCardSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E0E2E6] bg-white p-10 text-center">
        <p className="text-sm font-semibold text-[#1E293B]">
          Something went wrong loading proposals.
        </p>
        <Button type="button" variant="outline" onClick={onRetry} className="rounded-full px-6">
          Try again
        </Button>
      </div>
    )
  }

  if (proposals.length === 0) {
    return <NoResults title={emptyMessage} />
  }

  return (
    <div className="space-y-4">
      <div className="space-y-8">
        {proposals.map((proposal) => (
          <LearnRequestProposalCard
            onSelect={() => {
              setSelectedProposalId(proposal.id)
              setIsSheetOpen(true)
            }}
            key={proposal.id}
            proposal={proposal}
            learnRequestId={learnRequestId}
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
      <ProposalDetailsSheet
        key={selectedProposal?.id ?? 'none'}
        proposal={selectedProposal}
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        learnRequestId={learnRequestId}
        learnRequestStatus={learnRequestStatus}
        onHire={(proposalId) => hireMutation.mutate(proposalId)}
        isHiring={
          !!selectedProposal &&
          hireMutation.isPending &&
          hireMutation.variables === selectedProposal.id
        }
      />
    </div>
  )
}

export default LearnRequestProposalList
