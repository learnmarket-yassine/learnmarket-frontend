import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/layout/ConfirmModal'
import { ProposalStatus } from '../../store/types'
import useWithdrawProposal from '../../hooks/useWithdrawProposal'

type WithdrawProposalActionProps = {
  proposalId: string
  status: ProposalStatus
}

const WithdrawProposalAction = ({ proposalId, status }: WithdrawProposalActionProps) => {
  const navigate = useNavigate()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { mutateAsync: withdraw, isPending: isWithdrawing } = useWithdrawProposal(proposalId)

  return (
    <>
      <Button
        type="button"
        disabled={status !== 'PENDING'}
        variant="outline"
        onClick={() => setIsConfirmOpen(true)}
        className="w-full whitespace-nowrap rounded-full border-[#2563EB] bg-white py-6 font-medium text-[#2563EB] hover:bg-white/90 hover:text-[#2563EB]/90"
      >
        Withdraw proposal
      </Button>
      <ConfirmModal
        name="Event Exception Modal"
        type="confirm"
        isOpen={isConfirmOpen}
        setIsOpen={(next) => setIsConfirmOpen(!!next)}
        title="Withdraw this proposal?"
        description="Withdrawing this proposal can't be undone. The learner will see it as withdrawn."
        handleConfirm={async () => {
          await withdraw()
          setIsConfirmOpen(false)
          navigate('/proposals')
        }}
        isLoading={isWithdrawing}
        confirmButtonText="Withdraw"
        cancelButtonText="Cancel"
      />
    </>
  )
}

export default WithdrawProposalAction
