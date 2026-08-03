import { useNavigate } from 'react-router-dom'
import { ProposalGroup } from '../../store/types'
import useGetMyProposals, { MY_PROPOSALS_PAGE_SIZE } from '../../hooks/useGetMyProposals'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/features/myProfile/components/ui/EmptyState'
import MyProposalRow from './MyProposalRow'
import LearnRequestPagination from '@/features/learn-requests/components/ui/LearnRequestPagination'
import { EmptyPage } from '@/features/sessions/components/ui/EmptyPage'
import { Button } from '@/components/ui/button'

const EMPTY_STATE_COPY = {
  ACTIVE: "No active proposals yet. Once you send proposals to learners, they'll appear here.",
  ARCHIVED:
    "No archived proposals yet. Your previous proposals will appear here once they're closed or withdrawn.",
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
      <EmptyPage
        description={EMPTY_STATE_COPY[group]}
        actionButton={
          <Button
            type="button"
            onClick={() => navigate('/accueil')}
            aria-label="Create Announcement"
            className={`h-full border border-[#2563EB] bg-[#2563EB] p-3 text-white hover:bg-[#2563EB]`}
          >
            <span>Search for learn requests</span>
          </Button>
        }
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
              navigate(
                proposal.status === 'ACCEPTED'
                  ? `/requests/${proposal.id}`
                  : `/proposals/${proposal.id}`
              )
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
