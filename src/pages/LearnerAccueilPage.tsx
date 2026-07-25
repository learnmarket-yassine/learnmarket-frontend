import { useState } from 'react'
import LearnerAccueilPageLayout from '@/features/Accueil/components/layout/LearnerAccueilLayout'
import useGetLearnRequests, {
  LEARN_REQUESTS_PAGE_SIZE,
  LearnRequestFilters,
} from '@/features/learn-requests/hooks/useGetLearnRequests'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import LearnRequestSection from '@/features/Accueil/components/layout/LearnRequestSection'

type PillFilter = 'ALL' | 'IN_PROGRESS' | 'ACTION_NEEDED' | 'DRAFTS'

const PILLS: { name: string; value: PillFilter }[] = [
  { name: 'All', value: 'ALL' },
  { name: 'In progress', value: 'IN_PROGRESS' },
  { name: 'Action needed', value: 'ACTION_NEEDED' },
  { name: 'Drafts', value: 'DRAFTS' },
]

const filtersForPill = (pill: PillFilter): LearnRequestFilters => {
  switch (pill) {
    case 'IN_PROGRESS':
      return { status: ['OPEN', 'CLOSED'] }
    case 'ACTION_NEEDED':
      return { actionNeeded: true }
    case 'DRAFTS':
      return { status: ['DRAFT'] }
    default:
      return {}
  }
}

const LearnerAccueilPage = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<PillFilter>('ALL')
  const [page, setPage] = useState(0)

  const handleFilterChange = (filter: PillFilter) => {
    setActiveFilter(filter)
    setPage(0)
  }

  const { data, isLoading, isError, isPlaceholderData } = useGetLearnRequests(
    filtersForPill(activeFilter),
    page,
    LEARN_REQUESTS_PAGE_SIZE
  )
  const myLearningRequests = data?.paginatedResult ?? []
  const totalCount = data?.totalCount ?? 0

  return (
    <LearnerAccueilPageLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-[#1E293B]">Your learning requests</h2>
          <Button
            onClick={() => navigate('/learn-request/create')}
            className="h-full whitespace-nowrap rounded-full bg-[#143681] px-6 py-3 font-semibold text-white hover:bg-[#143681]"
          >
            <Plus className="h-4 w-4" />
            New request
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {PILLS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleFilterChange(filter.value)}
                className={cn(
                  'cursor-pointer gap-1 rounded-full border px-3 py-1 text-sm font-bold text-[#143681]',
                  activeFilter === filter.value ? 'bg-[#143681] text-white' : 'bg-white'
                )}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* ── Your learning requests ────────────────────────────────────── */}
      <LearnRequestSection
        myLearningRequests={myLearningRequests}
        currentPage={page}
        totalCount={totalCount}
        take={LEARN_REQUESTS_PAGE_SIZE}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        isPlaceholderData={isPlaceholderData}
      />
    </LearnerAccueilPageLayout>
  )
}

export default LearnerAccueilPage
