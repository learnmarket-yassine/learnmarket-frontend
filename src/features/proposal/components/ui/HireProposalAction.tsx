import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/layout/ConfirmModal'
import { ProposalStatus } from '../../store/types'
import { LearnRequestStatus } from '@/features/learn-requests/store/types'

type HireProposalActionProps = {
  proposalId: string
  proposalStatus: ProposalStatus
  learnRequestStatus: LearnRequestStatus
  tutorName: string
  onHire: (proposalId: string) => void
  isHiring: boolean
}

const HireProposalAction = ({
  proposalId,
  proposalStatus,
  learnRequestStatus,
  tutorName,
  onHire,
  isHiring,
}: HireProposalActionProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const isPending = proposalStatus === 'PENDING'
  const canHire = isPending && learnRequestStatus === 'OPEN'

  if (!isPending) return null

  return (
    <>
      <Button
        type="button"
        disabled={!canHire || isHiring}
        onClick={(e) => {
          e.stopPropagation()
          setIsConfirmOpen(true)
        }}
        className="whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-6 font-medium text-white hover:bg-[#113991] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isHiring ? 'Hiring...' : 'Hire'}
      </Button>
      <ConfirmModal
        name="Event Exception Modal"
        type="confirm"
        isOpen={isConfirmOpen}
        setIsOpen={(next) => setIsConfirmOpen(!!next)}
        title="Hire this tutor?"
        description={`Hiring ${tutorName} will close this request and decline all other pending proposals. This can't be undone.`}
        handleConfirm={async () => {
          await onHire(proposalId)
          setIsConfirmOpen(false)
        }}
        isLoading={isHiring}
        confirmButtonText="Confirm hire"
        cancelButtonText="Cancel"
      />
    </>
  )
}

export default HireProposalAction
