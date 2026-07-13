import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useCountdown } from '../../hooks/useCountdown'
import type { CountdownUrgency } from '../../utils/countdown'

const URGENCY_CLASSNAMES: Record<CountdownUrgency, string> = {
  normal: 'border-transparent bg-teal-100 text-teal-800',
  warning: 'border-transparent bg-amber-100 text-amber-800',
  critical: 'border-transparent bg-red-100 text-red-800',
}

interface HoldCountdownBadgeProps {
  expiresAt: string
}

const HoldCountdownBadge = ({ expiresAt }: HoldCountdownBadgeProps) => {
  const countdown = useCountdown(expiresAt)
  return (
    <Badge variant="outline" className={cn(URGENCY_CLASSNAMES[countdown.urgency])}>
      Holding for {countdown.formatted}
    </Badge>
  )
}

export default HoldCountdownBadge
