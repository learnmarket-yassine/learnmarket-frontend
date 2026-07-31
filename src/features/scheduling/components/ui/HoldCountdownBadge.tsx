import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCountdown } from '../../hooks/useCountdown'
import type { CountdownUrgency } from '../../utils/countdown'

const URGENCY_CLASSNAMES: Record<CountdownUrgency, string> = {
  normal: 'bg-blue-900',
  warning: 'bg-amber-900',
  critical: 'bg-red-900',
}

interface HoldCountdownBadgeProps {
  expiresAt: string
}

const HoldCountdownBadge = ({ expiresAt }: HoldCountdownBadgeProps) => {
  const countdown = useCountdown(expiresAt)
  return (
    <span
      className={cn(
        'mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white',
        URGENCY_CLASSNAMES[countdown.urgency]
      )}
    >
      <Clock className="size-3.5" />
      Holding for {countdown.formatted}
    </span>
  )
}

export default HoldCountdownBadge
