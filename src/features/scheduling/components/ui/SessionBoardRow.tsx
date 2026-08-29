import { useId } from 'react'
import { CheckCircle2, Eye } from 'lucide-react'
import { RichTextContent } from '@/components/ui/rich-text-content'
import { cn } from '@/lib/utils'
import type { Proposal, Session } from '../../types/dto'
import { SESSION_STATUS_LABELS } from '../../utils/sessions'
import { SESSION_BOARD_STYLES, getSessionBoardBucket } from '../../utils/sessionBoard'
import ScheduleSessionModal from './ScheduleSessionModal'
import { useNavigate } from 'react-router-dom'

type SessionBoardRowProps = {
  session: Session
  proposal: Proposal
  canSchedule: boolean
  isExpanded: boolean
  onToggleObjective: () => void
}

const JOINABLE_STATUSES: Session['status'][] = ['BOOKED', 'PENDING_REVIEW', 'COMPLETED', 'DISPUTED']

const SessionBoardRow = ({
  session,
  proposal,
  canSchedule,
  isExpanded,
  onToggleObjective,
}: SessionBoardRowProps) => {
  const panelId = useId()
  const bucket = getSessionBoardBucket(session.status)
  const navigate = useNavigate()
  const style = SESSION_BOARD_STYLES[bucket]
  const StatusIcon = style.icon
  const objective = session.objective?.trim() ? session.objective : null

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-[#E0E2E6] bg-white p-4">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
        {session.sessionNumber}
      </span>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-[#1E293B]">{session.title}</p>
          <span
            className={cn(
              'inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
              style.pillClassName
            )}
          >
            <StatusIcon className="size-3.5" />
            {SESSION_STATUS_LABELS[session.status]}
          </span>
        </div>

        {objective ? (
          <div className="space-y-1">
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={onToggleObjective}
              className="text-xs font-semibold text-[#2563EB] underline underline-offset-2"
            >
              {isExpanded ? 'Hide objective' : 'Read objective'}
            </button>
            {isExpanded && (
              <div id={panelId} role="region" className="pt-1">
                <RichTextContent html={objective} className="text-sm text-[#374151]" />
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm italic text-[#9CA3AF]">No objective provided</p>
        )}
      </div>

      <div className="shrink-0 pt-0.5">
        {bucket === 'completed' && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Done
          </span>
        )}
        {JOINABLE_STATUSES.includes(session.status) && (
          <button
            type="button"
            aria-label="View session details"
            className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-[#1D50BB] hover:text-white"
            onClick={() => {
              navigate(`/proposals/${session.proposalId}/sessions/${session.id}`)
            }}
          >
            <Eye className="size-5" />
          </button>
        )}
        {bucket === 'ready' && canSchedule && (
          <ScheduleSessionModal
            session={session}
            tutorId={proposal.tutorId}
            durationMinutes={proposal.sessionDurationMinutes}
          />
        )}
      </div>
    </div>
  )
}

export default SessionBoardRow
