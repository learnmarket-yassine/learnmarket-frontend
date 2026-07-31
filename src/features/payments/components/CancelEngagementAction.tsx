import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/layout/ConfirmModal'
import useCancelProposal from '../hooks/useCancelProposal'

interface CancelEngagementActionProps {
  learnRequestId: string
  proposalId: string
}

const CancelEngagementAction = ({ learnRequestId, proposalId }: CancelEngagementActionProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const cancelProposal = useCancelProposal(learnRequestId)

  return (
    <>
      <Button
        type="button"
        className="bg-white px-5 font-medium text-red-600 transition-all duration-200 hover:text-red-700 hover:underline"
        onClick={() => setIsConfirmOpen(true)}
      >
        Cancel Engagement
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
