import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import LearnRequestCard, { LearnRequestPreview } from '../ui/LearningRequestCard'

export type PillFilter = 'ALL' | 'IN_PROGRESS' | 'ACTION_NEEDED' | 'DRAFTS'

const PILLS: { name: string; value: PillFilter }[] = [
  { name: 'All', value: 'ALL' },
  { name: 'In progress', value: 'IN_PROGRESS' },
  { name: 'Action needed', value: 'ACTION_NEEDED' },
  { name: 'Drafts', value: 'DRAFTS' },
]

type LearnRequestSectionProps = {
  myLearningRequests: LearnRequestPreview[]
  activeFilter: PillFilter
  onFilterChange: (filter: PillFilter) => void
}

const LearnRequestSection: React.FC<LearnRequestSectionProps> = ({
  myLearningRequests,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <section className="flex flex-col space-y-10">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-[#1E293B]">Your learning requests</h2>
          <Button className="h-full whitespace-nowrap rounded-full bg-[#143681] px-6 py-3 font-semibold text-white hover:bg-[#143681]">
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
                onClick={() => onFilterChange(filter.value)}
                className={cn(
                  'cursor-pointer gap-1 rounded-full border px-3 py-1 text-sm font-bold text-[#143681]',
                  activeFilter === filter.value ? 'bg-[#143681] text-white' : 'bg-white'
                )}
              >
                {filter.name}
              </button>
            ))}
          </div>
          <Link
            to="/learning-requests"
            className="px-4 text-base font-bold text-[#143681] hover:underline"
          >
            View all requests
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myLearningRequests.map((request) => (
          <LearnRequestCard key={request.id} {...request} />
        ))}
      </div>
    </section>
  )
}

export default LearnRequestSection
