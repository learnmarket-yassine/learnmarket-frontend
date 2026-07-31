import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { formatBudget } from '@/lib/utils'
import useGetTutorFeedback from '../../hooks/useGetTutorFeedback'
import StarRating from './StarRating'

interface TutorFeedbackSectionProps {
  tutorId: string | undefined
}

function formatEngagementRange(start: string, end: string | null) {
  const startLabel = format(start, 'MMM yyyy')
  if (!end) return startLabel
  return `${startLabel} - ${format(end, 'MMM yyyy')}`
}

function TutorFeedbackSection({ tutorId }: TutorFeedbackSectionProps) {
  const { data: feedbacks, isLoading } = useGetTutorFeedback(tutorId)

  return (
    <div className="space-y-6 rounded-lg border border-[#D1D5DA] p-8">
      <h2 className="text-3xl font-semibold text-[#143681]">
        Reviews{feedbacks && feedbacks.length > 0 ? ` (${feedbacks.length})` : ''}
      </h2>

      {isLoading ? (
        <Skeleton className="h-24 w-full rounded-2xl" />
      ) : !feedbacks || feedbacks.length === 0 ? (
        <p className="text-base text-gray-400">No reviews yet.</p>
      ) : (
        <div className="space-y-6 divide-y divide-[#D1D5DA] divide-border">
          {feedbacks.map((entry) => (
            <div key={entry.id} className="flex justify-between gap-6 pt-6 first:pt-0">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-semibold text-[#143681]">{entry.learnRequestTitle}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <StarRating rating={entry.rating} size="sm" />
                  <span className="font-semibold text-[#143681]">{entry.rating.toFixed(1)}</span>
                  {entry.comment && (
                    <span className="whitespace-pre-wrap break-words text-[#143681]">
                      {entry.comment}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  By: {entry.author.firstname} {entry.author.lastname}
                </p>
              </div>
              <div className="shrink-0 space-y-0.5 text-right text-sm text-gray-500">
                <p>{formatEngagementRange(entry.engagementStart, entry.engagementEnd)}</p>
                <p className="font-semibold text-[#143681]">
                  Billed: ${formatBudget(entry.billedAmount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TutorFeedbackSection
