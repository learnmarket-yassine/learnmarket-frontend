import { cn } from '@/lib/utils'
import { PaymentStatus } from '../../store/types'

const STATUS_CLASSNAMES: Record<PaymentStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  SUCCEEDED: 'bg-emerald-50 text-emerald-700',
  FAILED: 'bg-red-50 text-red-600',
  REFUNDED: 'bg-amber-50 text-amber-700',
  PARTIALLY_REFUNDED: 'bg-amber-50 text-amber-700',
}

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  SUCCEEDED: 'Succeeded',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
  PARTIALLY_REFUNDED: 'Partially refunded',
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus
}

const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => (
  <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', STATUS_CLASSNAMES[status])}>
    {STATUS_LABELS[status]}
  </span>
)

export default PaymentStatusBadge
