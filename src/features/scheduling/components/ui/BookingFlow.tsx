import { Skeleton } from '@/components/ui/skeleton'
import { getBrowserTimezone } from '../../utils/timezones'
import SlotSelectionGrid from './SlotSelectionGrid'
import CourseList from './CourseList'
import HoldSlotModal from './HoldModal'
import SessionsSummary from './SessionsSummary'
import SuccessModal from '@/components/ui/SuccessModal'
import { useGetProposal } from '../../hooks/useGetProposal'
import { useBookingFlow } from '../../hooks/useBookingFlow'

interface BookingFlowProps {
  proposalId: string
}

const BookingFlow = ({ proposalId }: BookingFlowProps) => {
  const proposalQuery = useGetProposal(proposalId)
  const timezone = getBrowserTimezone()
  const sessions = proposalQuery.data?.sessions ?? []
  const {
    state,
    activeSession,
    isConfirming,
    selectSession,
    selectSlot,
    confirm,
    chooseDifferentTime,
    modalState,
    handleCloseModal,
  } = useBookingFlow(sessions)

  if (proposalQuery.isPending) {
    return (
      <div className="rounded-3xl border border-[#E0E2E6] bg-white p-6">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  if (proposalQuery.isError) {
    return (
      <div className="rounded-3xl border border-[#E0E2E6] bg-white p-6">
        <p className="text-sm text-destructive">Couldn't load this booking.</p>
      </div>
    )
  }

  const proposal = proposalQuery.data

  return (
    <div className="overflow-hidden rounded-3xl border border-[#E0E2E6] bg-white">
      {activeSession ? (
        <div className="flex flex-row">
          <CourseList
            sessions={proposal.sessions}
            activeSessionId={activeSession.id}
            onSelectSession={(session) => selectSession(session.id)}
          />
          <div className="flex-1 p-6">
            <SlotSelectionGrid
              tutorId={proposal.tutorId}
              sessionId={activeSession.id}
              durationMinutes={proposal.sessionDurationMinutes}
              onHoldCreated={selectSlot}
            />
          </div>
        </div>
      ) : (
        <SessionsSummary sessions={proposal.sessions} />
      )}

      {state.step === 'holding' && (
        <HoldSlotModal
          open
          onOpenChange={(open) => !open && chooseDifferentTime()}
          hold={state.hold}
          timezone={timezone}
          isConfirming={isConfirming}
          onConfirm={confirm}
          onChooseDifferentTime={chooseDifferentTime}
        />
      )}

      <SuccessModal
        name="confirm hold"
        {...modalState}
        setIsOpen={(open) => !open && handleCloseModal()}
        onButtonClick={handleCloseModal}
        isLoading={false}
        titleButton={modalState.type === 'error' ? 'Go Back' : 'Back to Home'}
      />
    </div>
  )
}

export default BookingFlow
