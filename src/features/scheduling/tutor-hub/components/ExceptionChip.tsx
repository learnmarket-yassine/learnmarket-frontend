import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { AvailabilityException } from '../../types/dto'
import { formatTimeRange } from '../../utils/time'

interface ExceptionChipProps {
  exception: AvailabilityException
  onRemove: () => void
  isRemoving?: boolean
}

const ExceptionChip = ({ exception, onRemove, isRemoving }: ExceptionChipProps) => {
  const isWholeDay = exception.startTime === null || exception.endTime === null

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5">
      <Badge variant={exception.type === 'BLOCKED' ? 'destructive' : 'secondary'}>
        {exception.type === 'BLOCKED' ? 'Blocked' : 'Added'}
      </Badge>
      <span className="text-sm">
        {isWholeDay
          ? 'Full day'
          : formatTimeRange(exception.startTime as number, exception.endTime as number)}
      </span>
      {exception.reason && (
        <span className="text-xs text-muted-foreground">— {exception.reason}</span>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="ml-auto"
        onClick={onRemove}
        disabled={isRemoving}
        aria-label="Remove override"
      >
        <X />
      </Button>
    </div>
  )
}

export default ExceptionChip
