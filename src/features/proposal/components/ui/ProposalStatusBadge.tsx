import { PROPOSAL_STATUS_LABELS } from '../../constants/labels'
import { ProposalStatus } from '../../store/types'

type ProposalStatusBadgeProps = {
  status: ProposalStatus
}

const ProposalStatusBadge = ({ status }: ProposalStatusBadgeProps) => (
  <span className="whitespace-nowrap rounded-sm bg-blue-900 px-4 py-1 text-sm font-medium text-white">
    {PROPOSAL_STATUS_LABELS[status]}
  </span>
)

export default ProposalStatusBadge
