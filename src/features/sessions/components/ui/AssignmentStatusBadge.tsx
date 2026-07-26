import { cn } from '@/lib/utils'
import { AssignmentDisplayStatus } from '@/features/scheduling/types/dto'

const STATUS_CLASSNAMES: Record<AssignmentDisplayStatus, string> = {
  ASSIGNED: 'bg-gray-100 text-gray-600',
  SUBMITTED: 'bg-emerald-50 text-emerald-700',
  EXCUSED: 'bg-purple-50 text-purple-700',
  LATE: 'bg-red-50 text-red-600',
}

const STATUS_LABELS: Record<AssignmentDisplayStatus, string> = {
  ASSIGNED: 'Assigned',
  SUBMITTED: 'Submitted',
  EXCUSED: 'Excused',
  LATE: 'Late',
}

interface AssignmentStatusBadgeProps {
  status: AssignmentDisplayStatus
}

const AssignmentStatusBadge = ({ status }: AssignmentStatusBadgeProps) => (
  <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', STATUS_CLASSNAMES[status])}>
    {STATUS_LABELS[status]}
  </span>
)

export default AssignmentStatusBadge
