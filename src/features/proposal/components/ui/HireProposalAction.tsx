import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/layout/ConfirmModal'
import CheckoutModal from '@/features/payments/components/CheckoutModal'
import CheckoutWaitingModal from '@/features/payments/components/CheckoutWaitingModal'
import useCreateCheckout from '@/features/payments/hooks/useCreateCheckout'
import { ProposalStatus } from '../../store/types'
import { LearnRequestStatus } from '@/features/learn-requests/store/types'

type HireProposalActionProps = {
  proposalId: string
  proposalStatus: ProposalStatus
  learnRequestId: string
  learnRequestStatus: LearnRequestStatus
  tutorName: string
}

const HireProposalAction = ({
  proposalId,
  proposalStatus,
  learnRequestId,
  learnRequestStatus,
  tutorName,
}: HireProposalActionProps) => {
  const queryClient = useQueryClient()
  const createCheckout = useCreateCheckout()

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isWaiting, setIsWaiting] = useState(false)

  const isPending = proposalStatus === 'PENDING'
  const canHire = isPending && learnRequestStatus === 'OPEN'

  if (!isPending) return null

  const handleAccepted = () => {
    setIsWaiting(false)
    queryClient.invalidateQueries({ queryKey: ['learnRequest', learnRequestId] })
  }

  return (
    <>
      <Button
        type="button"
        disabled={!canHire || createCheckout.isPending}
        onClick={(e) => {
          e.stopPropagation()
          setIsConfirmOpen(true)
        }}
        className="whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-6 font-medium text-white hover:bg-[#113991] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createCheckout.isPending ? 'Preparing checkout...' : 'Hire & pay'}
      </Button>
      <ConfirmModal
        name="Event Exception Modal"
        type="confirm"
        isOpen={isConfirmOpen}
        setIsOpen={(next) => setIsConfirmOpen(!!next)}
        title="Hire this tutor?"
        description={`Hiring ${tutorName} will close this request and decline all other pending proposals. You'll be asked to pay the full amount now.`}
        handleConfirm={async () => {
          const result = await createCheckout.mutateAsync(proposalId)
          setIsConfirmOpen(false)
          if (result.clientSecret) {
            setClientSecret(result.clientSecret)
          }
        }}
        isLoading={createCheckout.isPending}
        confirmButtonText="Continue to payment"
        cancelButtonText="Cancel"
      />
      {clientSecret && (
        <CheckoutModal
          open={!!clientSecret}
          clientSecret={clientSecret}
          tutorName={tutorName}
          onClose={() => setClientSecret(null)}
          onConfirmed={() => {
            setClientSecret(null)
            setIsWaiting(true)
          }}
        />
      )}
      <CheckoutWaitingModal
        open={isWaiting}
        proposalId={proposalId}
        onAccepted={handleAccepted}
        onDismiss={() => setIsWaiting(false)}
      />
    </>
  )
}

export default HireProposalAction
