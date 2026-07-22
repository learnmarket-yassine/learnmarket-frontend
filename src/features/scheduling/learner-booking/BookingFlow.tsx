import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import type { Booking, Session, SlotHold } from '../types/dto'
import type { SessionStatus } from '../types/enums'
import { isHoldExpiredError } from '../utils/errors'
import { getBrowserTimezone } from '../utils/timezones'
import BookingConfirmed from './components/BookingConfirmed'
import CourseProgressStepper from './components/CourseProgressStepper'
import HoldCountdownBadge from './components/HoldCountdownBadge'
import SlotSelectionGrid from './components/SlotSelectionGrid'
import { useProposal } from './hooks/useProposal'
import { useConfirmHold, useReleaseHold } from './hooks/useSlotHold'

type BookingFlowState =
  | { step: 'selecting' }
  | { step: 'holding'; hold: SlotHold }
  | { step: 'expired'; reason: 'timeout' | 'taken' }
  | { step: 'confirmed'; booking: Booking }

const ACTIONABLE_STATUSES: SessionStatus[] = ['PENDING_SCHEDULE', 'HELD', 'CANCELLED']

function findActiveSession(sessions: Session[]): Session | undefined {
  return sessions.find((session) => ACTIONABLE_STATUSES.includes(session.status))
}

interface BookingFlowProps {
  proposalId: string
}

const BookingFlow = ({ proposalId }: BookingFlowProps) => {
  const proposalQuery = useProposal(proposalId)
  const [state, setState] = useState<BookingFlowState>({ step: 'selecting' })
  const confirmHold = useConfirmHold()
  const releaseHold = useReleaseHold()
  const timezone = getBrowserTimezone()

  if (proposalQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (proposalQuery.isError) {
    return <p className="text-sm text-destructive">Couldn&apos;t load this booking.</p>
  }

  const proposal = proposalQuery.data
  const isCourse = proposal.jobRequest?.type === 'COURSE'
  const activeSession = findActiveSession(proposal.sessions)

  const handleConfirm = async () => {
    if (state.step !== 'holding') return
    try {
      const booking = await confirmHold.mutateAsync(state.hold.id)
      setState({ step: 'confirmed', booking })
    } catch (error) {
      setState({ step: 'expired', reason: isHoldExpiredError(error) ? 'timeout' : 'taken' })
    }
  }

  const handleChooseDifferentTime = () => {
    if (state.step === 'holding') releaseHold.mutate(state.hold.id)
    setState({ step: 'selecting' })
  }

  return (
    <div className="flex flex-col gap-6">
      {isCourse && (
        <CourseProgressStepper
          sessions={proposal.sessions}
          onSelectSession={() => setState({ step: 'selecting' })}
        />
      )}

      {!activeSession && state.step !== 'confirmed' && (
        <p className="text-sm text-muted-foreground">There&apos;s nothing to schedule right now.</p>
      )}

      {activeSession && state.step === 'selecting' && (
        <SlotSelectionGrid
          tutorId={proposal.tutorId}
          sessionId={activeSession.id}
          durationMinutes={proposal.sessionDurationMinutes}
          onHoldCreated={(hold) => setState({ step: 'holding', hold })}
        />
      )}

      {state.step === 'holding' && (
        <div className="flex flex-col items-start gap-4 rounded-lg border border-border p-4">
          <HoldCountdownBadge expiresAt={state.hold.expiresAt} />
          <div className="flex gap-2">
            <Button onClick={handleConfirm} disabled={confirmHold.isPending}>
              {confirmHold.isPending ? 'Confirming…' : 'Confirm booking'}
            </Button>
            <Button variant="outline" onClick={handleChooseDifferentTime}>
              Choose a different time
            </Button>
          </div>
        </div>
      )}

      {state.step === 'expired' && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {state.reason === 'taken'
              ? 'That time was booked by someone else.'
              : 'Your hold expired after 10 minutes.'}
          </p>
          <Button onClick={() => setState({ step: 'selecting' })}>Back to available times</Button>
        </div>
      )}

      {state.step === 'confirmed' && (
        <BookingConfirmed
          booking={state.booking}
          timezone={timezone}
          onDone={() => setState({ step: 'selecting' })}
        />
      )}
    </div>
  )
}

export default BookingFlow
