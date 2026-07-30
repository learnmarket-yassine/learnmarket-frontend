import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PayoutStatus } from '../../store/types'

const STATUS_CLASSNAMES: Record<PayoutStatus, string> = {
  RELEASED: 'bg-emerald-50 text-emerald-700',
  PENDING: 'bg-gray-100 text-gray-600',
  PENDING_ONBOARDING: 'bg-blue-50 text-[#2563EB]',
  HELD_FOR_REVIEW: 'bg-amber-50 text-amber-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  FAILED: 'bg-red-50 text-red-600',
}

const STATUS_LABELS: Record<PayoutStatus, string> = {
  RELEASED: 'Paid out',
  PENDING: 'Processing',
  PENDING_ONBOARDING: 'Processing',
  HELD_FOR_REVIEW: 'Under review',
  CANCELLED: 'Cancelled',
  FAILED: 'Failed',
}

interface PayoutStatusBadgeProps {
  status: PayoutStatus
}

const PayoutStatusBadge = ({ status }: PayoutStatusBadgeProps) => {
  const badge = (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
        STATUS_CLASSNAMES[status]
      )}
    >
      {STATUS_LABELS[status]}
      {status === 'HELD_FOR_REVIEW' && <Info className="size-3.5" />}
    </span>
  )

  if (status !== 'HELD_FOR_REVIEW') return badge

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="cursor-pointer">
          {badge}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm text-[#374151]">
        This session's attendance is being verified.
      </PopoverContent>
    </Popover>
  )
}

export default PayoutStatusBadge
