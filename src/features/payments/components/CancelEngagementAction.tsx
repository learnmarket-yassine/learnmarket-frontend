import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/layout/ConfirmModal'
import useCancelProposal from '../hooks/useCancelProposal'

interface CancelEngagementActionProps {
  learnRequestId: string
  proposalId: string
}

// Learner-only: cancels an already-hired, not-yet-completed engagement.
// Sessions that already happened are unaffected; the un-transferred
// portion of what was paid gets refunded server-side.
const CancelEngagementAction = ({ learnRequestId, proposalId }: CancelEngagementActionProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const cancelProposal = useCancelProposal(learnRequestId)

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="rounded-full border-red-300 px-6 text-red-600 hover:bg-red-50 hover:text-red-600"
        onClick={() => setIsConfirmOpen(true)}
      >
        Cancel engagement
      </Button>
      <ConfirmModal
        name="Event Exception Modal"
        type="delete"
        isOpen={isConfirmOpen}
        setIsOpen={(next) => setIsConfirmOpen(!!next)}
        title="Cancel this engagement?"
        description="Remaining sessions will be cancelled and any unused portion of your payment will be refunded. Sessions that already happened are not affected. This can't be undone."
        handleConfirm={async () => {
          await cancelProposal.mutateAsync({ proposalId })
          setIsConfirmOpen(false)
        }}
        isLoading={cancelProposal.isPending}
        confirmButtonText="Cancel engagement"
        cancelButtonText="Keep it"
      />
    </>
  )
}

export default CancelEngagementAction
