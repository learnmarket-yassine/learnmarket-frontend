import { useState } from 'react'
import useSubmitSessionSummary from '../../hooks/useSubmitSessionSummary'
import { SessionContext } from '../../hooks/useGetSessionContext'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { Button } from '@/components/ui/button'
import RichTextContent from '@/components/ui/rich-text-content'

type SessionTutorSummaryProps = {
  sessionId: string
  context: SessionContext
}

const SessionTutorSummary = ({ sessionId, context }: SessionTutorSummaryProps) => {
  const [summary, setSummary] = useState('')
  const { handleSubmitSummary, isPending } = useSubmitSessionSummary(sessionId)

  if (context.summarySubmittedAt && context.summary) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-[#102A63]">Your summary</p>
        <RichTextContent className="mt-2 max-w-screen-md" html={context.summary} />
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
