import { useState } from 'react'
import useSubmitSessionSummary from '../../hooks/useSubmitSessionSummary'
import { SessionContext } from '../../hooks/useGetSessionContext'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { Button } from '@/components/ui/button'
import RichTextContent from '@/components/ui/rich-text-content'
import { FileText } from 'lucide-react'
import { formatDateLabel, formatSlotTime } from '@/features/scheduling/utils/time'
import { getBrowserTimezone } from '@/features/scheduling/utils/timezones'

type SessionTutorSummaryProps = {
  sessionId: string
  context: SessionContext
}

const formatDateTime = (iso: string, timezone: string) =>
  `${formatDateLabel(iso, timezone)} at ${formatSlotTime(iso, timezone)}`

const SessionTutorSummary = ({ sessionId, context }: SessionTutorSummaryProps) => {
  const [summary, setSummary] = useState('')
  const timezone = getBrowserTimezone()
  const { handleSubmitSummary, isPending } = useSubmitSessionSummary(sessionId)

  if (context.summarySubmittedAt && context.summary) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E0E2E6] bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <FileText className="size-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#143681]">Tutor summary</h3>
              <p className="text-xs text-[#6B7280]">
                Submitted by {context.tutor.firstname} {context.tutor.lastname}
              </p>
            </div>
          </div>
          {context.summarySubmittedAt && (
            <span className="shrink-0 whitespace-nowrap text-xs text-[#6B7280]">
              {formatDateTime(context.summarySubmittedAt, timezone)}
            </span>
          )}
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <RichTextContent html={context.summary} className="text-base text-slate-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm">
        Summarize what was covered in this session. This is independent of whether the learner has
        responded yet.
      </p>
      <RichTextEditor
        value={summary ?? ''}
        onChange={(value) => setSummary(value)}
        placeholder="What should the learner do?"
        className="border-[0.5px] border-[#9CA3AF]"
        contentClassName="min-h-[120px]"
      />
      <div className="flex justify-end">
        <Button
          className="h-full w-fit rounded-full bg-[#2563EB] px-6 py-3 text-white hover:bg-[#2563EB]"
          disabled={!summary.trim() || isPending}
          onClick={() => handleSubmitSummary(summary)}
        >
          Submit summary
        </Button>
      </div>
    </div>
  )
}
export default SessionTutorSummary
