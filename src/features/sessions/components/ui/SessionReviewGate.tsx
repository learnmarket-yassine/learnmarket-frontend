import { useState } from 'react'
import { CheckCircle2, Circle, MessageSquareWarning } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SessionContext } from '../../hooks/useGetSessionContext'
import useSubmitSessionSummary from '../../hooks/useSubmitSessionSummary'
import useConfirmSession from '../../hooks/useConfirmSession'
import useDisputeSession from '../../hooks/useDisputeSession'

interface SessionReviewGateProps {
  sessionId: string
  context: SessionContext
}

// Two genuinely independent tracks -- the tutor's summary and the learner's
// confirm/dispute never react to each other. Each renders from its own
// fields only; neither reads the other's state to decide what to show.
const SessionReviewGate = ({ sessionId, context }: SessionReviewGateProps) => {
  if (context.status !== 'PENDING_REVIEW' && context.status !== 'COMPLETED') return null

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[#E5E7EB] bg-white p-6">
      <h3 className="text-lg font-semibold text-[#102A63]">Session review</h3>

      <div className="flex flex-col gap-2 rounded-2xl bg-[#F7F8FA] p-4 text-sm">
        <StatusRow
          label="Tutor"
          done={!!context.summarySubmittedAt}
          doneLabel="Summary submitted"
          pendingLabel="Awaiting summary"
        />
        <StatusRow
          label="Learner"
          done={!!context.learnerConfirmedAt || !!context.disputedAt}
          doneLabel={context.disputedAt ? 'Reported an issue' : 'Confirmed'}
          pendingLabel="Awaiting response"
        />
      </div>

      {context.isTutor ? (
        <TutorSummaryPanel sessionId={sessionId} context={context} />
      ) : (
        <LearnerResponsePanel sessionId={sessionId} context={context} />
      )}
    </div>
  )
}

const StatusRow = ({
  label,
  done,
  doneLabel,
  pendingLabel,
}: {
  label: string
  done: boolean
  doneLabel: string
  pendingLabel: string
}) => (
  <div className="flex items-center gap-2">
    {done ? (
      <CheckCircle2 className="size-4 text-emerald-600" />
    ) : (
      <Circle className="size-4 text-[#8E949F]" />
    )}
    <span className="font-medium text-[#102A63]">{label}:</span>
    <span className={done ? 'text-emerald-700' : 'text-[#8E949F]'}>
      {done ? doneLabel : pendingLabel}
    </span>
  </div>
)

const TutorSummaryPanel = ({ sessionId, context }: SessionReviewGateProps) => {
  const [summary, setSummary] = useState('')
  const { handleSubmitSummary, isPending } = useSubmitSessionSummary(sessionId)

  if (context.summarySubmittedAt) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-[#102A63]">Your summary</p>
        <p className="text-sm text-[#6B7280]">{context.summary}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-[#6B7280]">
        Summarize what was covered in this session. This is independent of whether the learner has
        responded yet.
      </p>
      <Textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="What did you cover in this session?"
        disabled={isPending}
      />
      <Button
        className="w-fit rounded-full bg-[#2563EB] px-6 hover:bg-[#2563EB]"
        disabled={!summary.trim() || isPending}
        onClick={() => handleSubmitSummary(summary)}
      >
        Submit summary
      </Button>
    </div>
  )
}

const LearnerResponsePanel = ({ sessionId, context }: SessionReviewGateProps) => {
  const [showDisputeForm, setShowDisputeForm] = useState(false)
  const [reason, setReason] = useState('')
  const { handleConfirmSession, isPending: isConfirming } = useConfirmSession(sessionId)
  const { handleDisputeSession, isPending: isDisputing } = useDisputeSession(sessionId)

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

  if (showDisputeForm) {
    return (
      <div className="flex flex-col gap-3">
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="What went wrong?"
          disabled={isDisputing}
        />
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={() => setShowDisputeForm(false)}
            disabled={isDisputing}
          >
            Back
          </Button>
          <Button
            className="rounded-full bg-[#B91C1C] px-6 hover:bg-[#B91C1C]"
            disabled={!reason.trim() || isDisputing}
            onClick={() => handleDisputeSession(reason)}
          >
            Submit report
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-[#6B7280]">
        Confirm that this session took place. This is your own independent attestation --
        {context.summarySubmittedAt
          ? " the tutor's summary above is shown as context, not something to agree or disagree with."
          : ' available whether or not the tutor has submitted a summary yet.'}
      </p>
      <div className="flex gap-3">
        <Button
          className="rounded-full bg-[#2563EB] px-6 hover:bg-[#2563EB]"
          disabled={isConfirming}
          onClick={() => handleConfirmSession()}
        >
          Confirm this session happened
        </Button>
        <Button
          variant="secondary"
          className="rounded-full"
          onClick={() => setShowDisputeForm(true)}
          disabled={isConfirming}
        >
          Something wasn't right
        </Button>
      </div>
    </div>
  )
}

export default SessionReviewGate
