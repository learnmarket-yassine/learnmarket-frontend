import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import SlotSelectionGrid from './SlotSelectionGrid'
import type { Session } from '../../types/dto'
import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { useBookingFlow } from '../../hooks/useBookingFlow'
import HoldSlotModal from './HoldModal'
import SuccessModal from '@/components/ui/SuccessModal'
import { getBrowserTimezone } from '../../utils/timezones'

interface ScheduleSessionModalProps {
  session: Session
  tutorId: string
  durationMinutes: number
}

const ScheduleSessionModal = ({ session, tutorId, durationMinutes }: ScheduleSessionModalProps) => {
  const [open, setOpen] = useState(false)

  const timezone = getBrowserTimezone()

  const {
    state,
    isConfirming,
    selectSlot,
    confirm,
    chooseDifferentTime,
    backToSelecting,
    modalState,
    handleCloseModal,
  } = useBookingFlow(session)

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value)

          if (!value) {
            backToSelecting()
          }
        }}
      >
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="Schedule session"
            className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-[#1D50BB] hover:text-white"
          >
            <CalendarClock className="size-5" />
          </button>
        </DialogTrigger>

        <DialogContent className="flex w-[720px] max-w-[92vw] flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#143681]">
              Schedule "{session.title}"
            </DialogTitle>
          </DialogHeader>
          <SlotSelectionGrid
            tutorId={tutorId}
            sessionId={session.id}
            durationMinutes={durationMinutes}
            onHoldCreated={selectSlot}
          />
        </DialogContent>
      </Dialog>

      {state.step === 'holding' && (
        <HoldSlotModal
          open
          onOpenChange={(value) => {
            if (!value) {
              chooseDifferentTime()
            }
          }}
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
        setIsOpen={(value) => {
          if (!value) {
            handleCloseModal()
          }
        }}
        onButtonClick={handleCloseModal}
        isLoading={false}
        titleButton={modalState.type === 'error' ? 'Go Back' : 'Back to Home'}
      />
    </>
  )
}

export default ScheduleSessionModal
