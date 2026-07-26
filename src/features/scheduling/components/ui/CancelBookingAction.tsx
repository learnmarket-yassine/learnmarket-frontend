import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/layout/ConfirmModal'
import { useCancelBooking } from '../../hooks/useCancelBooking'

type CancelBookingActionProps = {
  bookingId: string
}

const CancelBookingAction = ({ bookingId }: CancelBookingActionProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { handleCreateHold: cancelBooking, isPending } = useCancelBooking()

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        variant="outline"
        className="whitespace-nowrap rounded-full border-[#2563EB] bg-white px-6 py-6 font-medium text-[#2563EB] hover:bg-blue-50 hover:text-[#2563EB]/90"
      >
        Cancel
      </Button>
      <ConfirmModal
        name="Event Exception Modal"
        type="confirm"
        isOpen={isConfirmOpen}
        setIsOpen={(next) => setIsConfirmOpen(!!next)}
        title="Cancel this session?"
        description="This can't be undone. The other participant will be notified."
        handleConfirm={async () => {
          await cancelBooking(bookingId)
          setIsConfirmOpen(false)
        }}
        isLoading={isPending}
        confirmButtonText="Cancel session"
        cancelButtonText="Keep session"
      />
    </>
  )
}

export default CancelBookingAction
