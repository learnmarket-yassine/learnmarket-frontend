import { formatDistanceToNow } from 'date-fns'
import { MyProposal } from '../../store/types'
import ProposalStatusBadge from './ProposalStatusBadge'

type MyProposalRowProps = {
  proposal: MyProposal
  onSelect?: () => void
}

const MyProposalRow = ({ proposal, onSelect }: MyProposalRowProps) => {
  const createdAt = new Date(proposal.createdAt)
  const submittedOn = createdAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const relativeTime = formatDistanceToNow(createdAt, { addSuffix: true })

  return (
    <div
      onClick={onSelect}
      className="group flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#143681] hover:shadow-lg"
    >
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-xs font-medium text-[#6B7280]">
          Submitted {submittedOn} · {relativeTime}
        </p>
        <h1 className="block truncate text-base font-semibold text-[#143681] hover:underline">
          {proposal.learnRequest.title}
        </h1>
        <span className="inline-block rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-medium text-[#6B7280]">
          {proposal.learnRequest.category?.name ?? 'Uncategorized'}
        </span>
      </div>
      <ProposalStatusBadge status={proposal.status} />
    </div>
  )
}

export default MyProposalRow
