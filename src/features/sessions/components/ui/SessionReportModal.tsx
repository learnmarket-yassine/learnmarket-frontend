import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import SessionReportReasonBox from './SessionReportReasonBox'
import { SESSION_REPORT_REASONS } from '@/lib/Constants'
import useDisputeSession from '../../hooks/useDisputeSession'
import RichTextEditor from '@/components/ui/rich-text-editor'

type SessionReportModalProps = {
  sessionId: string
}

function SessionReportModal({ sessionId }: SessionReportModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [reason, setReason] = useState('')
  const { handleDisputeSession, isPending: isDisputing } = useDisputeSession(sessionId)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="h-full bg-red-800 px-6 py-3 text-white hover:bg-red-900 hover:underline"
            disabled={isDisputing}
          >
            Something wasn't right
          </Button>
        </DialogTrigger>
        <DialogContent
          className="flex min-w-[592px] flex-col space-y-2"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader className="space-y-5">
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-red-800">Report an issue</span>
                <button type="button" onClick={() => setIsOpen(false)}>
                  <X className="size-9" />
                </button>
              </div>
            </DialogTitle>
            <DialogDescription className="space-y-5 text-base text-[#5E5E5E]">
              <p className="text-sm text-[#6B7280]">
                If you encountered a problem with this session, please report it here. This will
                prevent payment from being released until the issue has been investigated.
              </p>
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-1 flex-col space-y-6 overflow-hidden"
            onSubmit={(e) => {
              e.preventDefault()
            }}
            noValidate
          >
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="space-y-3">
                <p className="font-semibold">What went wrong?</p>
                <div className="flex flex-wrap items-center gap-3">
                  {SESSION_REPORT_REASONS.map((reasonOption) => (
                    <SessionReportReasonBox
                      key={reasonOption}
                      reason={reasonOption}
                      onSelect={(selectedReason) => setSelectedReason(selectedReason)}
                      selectedReason={selectedReason}
                    />
                  ))}
                </div>
              </div>
              <RichTextEditor
                value={reason ?? ''}
                onChange={(value) => setReason(value)}
                placeholder="What should the learner do?"
                className="border-[0.5px] border-[#9CA3AF]"
                contentClassName="min-h-[120px]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="h-full whitespace-nowrap px-6 py-3 font-medium text-black hover:bg-[#F3F4F6]"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="h-full whitespace-nowrap bg-red-800 px-6 py-3 font-semibold text-white hover:bg-red-900"
                onClick={() => {
                  handleDisputeSession(reason)
                  setIsOpen(false)
                }}
              >
                Submit report
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SessionReportModal
