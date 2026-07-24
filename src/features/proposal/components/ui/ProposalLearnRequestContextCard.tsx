import ProposalJobDetailsCard from './CreateProposalForm/ProposalJobDetailsCard'
import { MyProposalDetail } from '../../store/types'
import { PAYOUT_METHOD_LABELS } from '../../constants/labels'
import { formatBudget } from '@/lib/utils'

type ProposalLearnRequestContextCardProps = {
  proposal: MyProposalDetail
}

const ProposalLearnRequestContextCard = ({ proposal }: ProposalLearnRequestContextCardProps) => {
  return (
    <div className="flex flex-col divide-y divide-[#E0E2E6] rounded-3xl border border-[#E0E2E6] bg-white p-5">
      <ProposalJobDetailsCard learnrequest={proposal.learnRequest} />
      <div className="space-y-6 p-5">
        <h3 className="text-xl font-bold">Your proposed terms</h3>
        <div className="space-y-1">
          <h5 className="text-base font-semibold text-[#143681]">How do you want to be paid?</h5>
          <p className="text-sm">{PAYOUT_METHOD_LABELS[proposal.payoutMethod]}</p>
        </div>
        <div className="space-y-1">
          <h5 className="text-base font-semibold text-[#143681]">Total price of Course</h5>
          <p className="text-sm">{formatBudget(proposal.totalPrice)} USD</p>
        </div>
      </div>
      <div className="space-y-2 p-5">
        <h5 className="text-base font-semibold text-[#143681]">You'll receive</h5>
        <p className="text-sm">{formatBudget(proposal.tutorTotal)} USD</p>
      </div>
    </div>
  )
}

export default ProposalLearnRequestContextCard
