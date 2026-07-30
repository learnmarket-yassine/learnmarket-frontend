import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { TutorRatingSummary } from '../../store/types'

interface TutorRatingBadgeProps {
  summary: TutorRatingSummary | undefined
}

function TutorRatingBadge({ summary }: TutorRatingBadgeProps) {
  if (!summary) return null

  if (summary.reviewCount === 0 || summary.averageRating === null) {
    return <span className="text-sm text-gray-400">No reviews yet</span>
  }

  return (
    <Badge
      variant="secondary"
      className="gap-1 rounded-full border-none bg-[#F5F6F7] px-2.5 py-1 text-sm text-[#102A63]"
    >
      <Star className="size-3.5 fill-current text-amber-400" aria-hidden="true" />
      {summary.averageRating.toFixed(1)} ({summary.reviewCount} review
      {summary.reviewCount === 1 ? '' : 's'})
    </Badge>
  )
}

export default TutorRatingBadge
