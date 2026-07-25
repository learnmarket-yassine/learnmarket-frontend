import { Skeleton } from '@/components/ui/skeleton'
import NoResults from '@/components/ui/NoResults'
import { cn } from '@/lib/utils'
import LearnRequestPagination from '@/features/learn-requests/components/ui/LearnRequestPagination'
import LearnRequestCard, { LearnRequestPreview } from '../ui/LearningRequestCard'

type LearnRequestSectionProps = {
  myLearningRequests: LearnRequestPreview[]
  currentPage: number
  totalCount: number
  take: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  isError?: boolean
  isPlaceholderData?: boolean
}

const LearnRequestSection: React.FC<LearnRequestSectionProps> = ({
  myLearningRequests,
  currentPage,
  totalCount,
  take,
  onPageChange,
  isLoading,
  isError,
  isPlaceholderData,
}) => {
  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl" />
        ))}
      </div>
    )

  if (isError) {
    return <p className="text-sm text-destructive">Couldn't load your learning requests.</p>
  }

  if (myLearningRequests.length === 0) {
    return <NoResults />
  }

  return (
    <section className="flex flex-col space-y-10">
      <div
        className={cn(
          'grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3',
          isPlaceholderData && 'opacity-60'
        )}
      >
        {myLearningRequests.map((request) => (
          <LearnRequestCard key={request.id} {...request} />
        ))}
      </div>
      <div className="flex items-center justify-end">
        <LearnRequestPagination
          currentPage={currentPage}
          totalCount={totalCount}
          take={take}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  )
}

export default LearnRequestSection
