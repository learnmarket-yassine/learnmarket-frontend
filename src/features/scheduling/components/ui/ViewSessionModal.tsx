import { Link } from 'react-router-dom'
import { CalendarIcon, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ProposalSessionObjective from '@/features/proposal/components/ui/ProposalSessionObjective'
import type { Session } from '../../types/dto'
import { getBrowserTimezone } from '../../utils/timezones'
import { formatDateLabel, formatSlotTime } from '../../utils/time'
import useGetSessionContext from '@/features/sessions/hooks/useGetSessionContext'
import SessionStatusBadge from './SessionStatusBadge'

interface ViewSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: Session
}

const ViewSessionModal = ({ open, onOpenChange, session }: ViewSessionModalProps) => {
  const { data: context } = useGetSessionContext(session.id, open)
  const timezone = getBrowserTimezone()
  const objective = context?.objective ?? session.objective

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[480px] flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#143681]">{session.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <SessionStatusBadge status={session.status} booking={context?.booking} />

          <div>
            <p className="text-sm font-semibold text-[#1E293B]">Objective</p>
            <ProposalSessionObjective objective={objective} />
          </div>

          {context?.booking && (
            <div className="flex flex-col gap-2 rounded-2xl border border-[#E0E2E6] bg-[#F9FAFB] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[#1E293B]">
                <CalendarIcon className="size-4 text-[#2563EB]" />
                {formatDateLabel(context.booking.startTime, timezone)}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#565A60]">
                <Clock className="size-4 text-[#2563EB]" />
                {formatSlotTime(context.booking.startTime, timezone)} –{' '}
                {formatSlotTime(context.booking.endTime, timezone)}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full text-[#1A46A7]"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            asChild
            className="rounded-full bg-[#2563EB] px-6 hover:bg-[#2563EB]"
            onClick={() => onOpenChange(false)}
          >
            <Link to={`/proposals/${session.proposalId}/sessions/${session.id}`}>
              Go to full session
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewSessionModal
