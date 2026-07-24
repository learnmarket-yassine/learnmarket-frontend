import { useNavigate } from 'react-router-dom'
import { ProposalGroup } from '../../store/types'
import useGetMyProposals, { MY_PROPOSALS_PAGE_SIZE } from '../../hooks/useGetMyProposals'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/features/myProfile/components/ui/EmptyState'
import MyProposalRow from './MyProposalRow'
import LearnRequestPagination from '@/features/learn-requests/components/ui/LearnRequestPagination'
import { ClipboardList } from 'lucide-react'

const EMPTY_STATE_COPY: Record<ProposalGroup, string> = {
  ACTIVE: "You don't have any active proposals yet",
  ARCHIVED: 'No archived proposals',
}

const MyProposalsList = ({
  group,
  page,
  setPage,
}: {
  group: ProposalGroup
  page: number
  setPage: (page: number) => void
}) => {
  const navigate = useNavigate()
  const { data, isLoading, isError, isPlaceholderData } = useGetMyProposals(group, page)
  const proposals = data?.paginatedResult ?? []
  const totalCount = data?.totalCount ?? 0

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError) {
    return <EmptyState message="Something went wrong while loading your proposals." />
  }

  if (proposals.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        message={EMPTY_STATE_COPY[group]}
        ctaLabel="Search for jobs"
        onCta={() => navigate('/accueil')}
      />
    )
  }

  return (
    <div className={`space-y-6 ${isPlaceholderData ? 'opacity-60' : ''}`}>
      <p className="text-lg font-bold text-[#1E293B]">Submitted proposals ({totalCount})</p>
      <div className="space-y-3">
        {proposals.map((proposal) => (
          <MyProposalRow
            onSelect={() => {
              navigate(`/proposals/${proposal.id}`)
            }}
            key={proposal.id}
            proposal={proposal}
          />
        ))}
      </div>
      {totalCount > MY_PROPOSALS_PAGE_SIZE && (
        <div className="flex items-center justify-end">
          <LearnRequestPagination
            currentPage={page}
            totalCount={totalCount}
            take={MY_PROPOSALS_PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
export default MyProposalsList
