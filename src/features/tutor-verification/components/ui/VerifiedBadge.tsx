import { BadgeCheck } from 'lucide-react'
import { TutorVerificationStatus } from '@/features/myProfile/store/types'

interface VerifiedBadgeProps {
  status: TutorVerificationStatus | null | undefined
}

function VerifiedBadge({ status }: VerifiedBadgeProps) {
  if (status !== 'APPROVED') return null

  return (
    <div className="flex items-center gap-1">
      <BadgeCheck className="size-3.5" aria-hidden="true" />
      <p className="text-sm font-medium text-[#225AD6] underline">Verified</p>
    </div>
  )
}

export default VerifiedBadge
