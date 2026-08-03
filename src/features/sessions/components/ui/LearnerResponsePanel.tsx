import { MessageSquareWarning } from 'lucide-react'
import { SessionContext } from '../../hooks/useGetSessionContext'
import SessionReportModal from './SessionReportModal'
import ConfirmSessionModal from './ConfirmSessionModal'

interface LearnerResponsePanelProps {
  sessionId: string
  context: SessionContext
}

const LearnerResponsePanel = ({ sessionId, context }: LearnerResponsePanelProps) => {
  if (context.status !== 'PENDING_REVIEW' && context.status !== 'COMPLETED') return null

  if (context.disputedAt) {
    return (
      <div className="flex flex-col gap-1">
        <p className="flex items-center gap-2 text-sm font-medium text-[#B91C1C]">
          <MessageSquareWarning className="size-4" />
          You reported an issue with this session
        </p>
        <p className="text-sm text-[#6B7280]">{context.disputeReason}</p>
      </div>
    )
  }

  if (context.learnerConfirmedAt) {
    return <p className="text-sm text-emerald-700">You confirmed this session took place.</p>
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-base text-[#6B7280]">
        Before payment is released, please verify the outcome of this session. Click Confirm if the
        tutor successfully delivered the agreed lesson. If the session was not delivered as expected
        or you encountered a problem, click Report to open a dispute and prevent payment from being
        released until the issue has been investigated.
      </p>
      <div className="flex gap-3">
        <ConfirmSessionModal sessionId={sessionId} />
        <SessionReportModal sessionId={sessionId} />
      </div>
    </div>
  )
}

export default LearnerResponsePanel
