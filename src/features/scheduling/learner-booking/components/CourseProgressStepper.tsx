import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Check, Lock } from 'lucide-react'
import type { ProposalSession } from '../../types/dto'
import type { ProposalSessionStatus } from '../../types/enums'

type StepVisual = 'completed' | 'current' | 'locked' | 'scheduled'

/**
 * Collapses the 6 backend statuses into the 4 visual states the stepper renders.
 * HELD (mid-hold) and CANCELLED (reschedulable) both read as "current" — the
 * learner still has something actionable on that step.
 */
function getStepVisual(status: ProposalSessionStatus): StepVisual {
  switch (status) {
    case 'COMPLETED':
      return 'completed'
    case 'BOOKED':
      return 'scheduled'
    case 'LOCKED':
      return 'locked'
    default:
      return 'current'
  }
}

const VISUAL_CLASSNAMES: Record<StepVisual, string> = {
  completed: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  current: 'bg-primary text-primary-foreground',
  scheduled: 'border-border bg-background text-foreground',
  locked: 'bg-muted text-muted-foreground',
}

interface CourseProgressStepperProps {
  sessions: ProposalSession[]
  onSelectSession?: (session: ProposalSession) => void
}

const CourseProgressStepper = ({ sessions, onSelectSession }: CourseProgressStepperProps) => {
  const ordered = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber)

  return (
    <ol className="flex gap-3 overflow-x-auto pb-1">
      {ordered.map((session, index) => {
        const visual = getStepVisual(session.status)
        const previous = ordered[index - 1]
        const label = `${session.sessionNumber}. ${session.title}`

        const content =
          visual === 'current' && onSelectSession ? (
            <Badge
              asChild
              variant="outline"
              className={cn('shrink-0 border-transparent', VISUAL_CLASSNAMES[visual])}
            >
              <button type="button" onClick={() => onSelectSession(session)}>
                {label}
              </button>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className={cn('shrink-0 border-transparent', VISUAL_CLASSNAMES[visual])}
            >
              {visual === 'completed' && <Check />}
              {visual === 'locked' && <Lock />}
              {label}
            </Badge>
          )

        if (visual === 'locked') {
          return (
            <li key={session.id}>
              <Tooltip>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent>
                  Unlocks after Session {previous?.sessionNumber ?? session.sessionNumber - 1} is
                  completed
                </TooltipContent>
              </Tooltip>
            </li>
          )
        }

        return <li key={session.id}>{content}</li>
      })}
    </ol>
  )
}

export default CourseProgressStepper
