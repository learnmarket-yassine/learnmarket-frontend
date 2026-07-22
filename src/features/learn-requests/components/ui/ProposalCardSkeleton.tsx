import { Skeleton } from '@/components/ui/skeleton'

const ProposalCardSkeleton = () => (
  <div className="flex items-start gap-4">
    <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
    <div className="flex-1 space-y-3">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-16 w-full" />
    </div>
  </div>
)
export default ProposalCardSkeleton
