import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ArrowLeft, CalendarCheck, MapPin, ThumbsUp, Wallet } from 'lucide-react'
import { Proposal, ProposalSessionPlan } from '../../store/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatBudget, getAssetUrl } from '@/lib/utils'
import { PAYOUT_METHOD_LABELS } from '../../constants/labels'
import { LearnRequestStatus } from '@/features/learn-requests/store/types'
import HireProposalAction from './HireProposalAction'
import { Button } from '@/components/ui/button'
import useLineClamp from '@/hooks/useLineClamp'

const COLLAPSED_SESSION_COUNT = 4
const OBJECTIVE_LINES = 2

type SessionTimelineItemProps = {
  session: ProposalSessionPlan
  isLast: boolean
}

const SessionTimelineItem = ({ session, isLast }: SessionTimelineItemProps) => {
  const {
    ref: objectiveRef,
    isExpanded,
    isClampable,
    toggle,
    className: clampClassName,
  } = useLineClamp(session.objective, { lines: OBJECTIVE_LINES })

  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-[#D9DEE6]"
        />
      )}
      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#143681] text-xs font-bold text-white">
        {session.sessionNumber}
      </span>
      <div className="flex-1 space-y-1 pt-0.5">
        <p className="text-sm font-semibold text-[#1E293B]">{session.title}</p>
        {session.objective && (
          <>
            <p ref={objectiveRef} className={`${clampClassName} text-sm text-[#6B7280]`}>
              {session.objective}
            </p>
            {isClampable && (
              <button
                type="button"
                onClick={toggle}
                className="text-xs font-semibold text-[#2563EB] underline underline-offset-2"
              >
                {isExpanded ? 'See less' : 'See more'}
              </button>
            )}
          </>
        )}
      </div>
    </li>
  )
}

type ProposalDetailsSheetProps = {
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  proposal: Proposal | null
  learnRequestStatus: LearnRequestStatus
  onHire: (proposalId: string) => void
  isHiring: boolean
}

const ProposalDetailsSheet: React.FC<ProposalDetailsSheetProps> = ({
  isOpen,
  setIsOpen,
  proposal,
  learnRequestStatus,
  onHire,
  isHiring,
}) => {
  const [showAllSessions, setShowAllSessions] = useState(false)

  if (!proposal) return null
  const { tutor } = proposal
  const initials =
    `${tutor.firstname?.charAt(0) ?? ''}${tutor.lastname?.charAt(0) ?? ''}`.toUpperCase()
  const fullName = `${tutor.firstname} ${tutor.lastname}`
  const submittedOn = new Date(proposal.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const sessionPlans = [...proposal.sessionPlans].sort((a, b) => a.sessionNumber - b.sessionNumber)
  const visibleSessions =
    showAllSessions || sessionPlans.length <= COLLAPSED_SESSION_COUNT
      ? sessionPlans
      : sessionPlans.slice(0, COLLAPSED_SESSION_COUNT)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent showCloseButton={false} side={'right'} className="min-w-[1020px] !border-0">
        <SheetHeader className="border-b-[0.5px] border-b-[#E0E2E6] p-5">
          <SheetTitle>
            <button type="button" onClick={() => setIsOpen?.(false)} aria-label="Close">
              <ArrowLeft />
            </button>
          </SheetTitle>
        </SheetHeader>
        <div className="no-scrollbar flex flex-col gap-6 divide-y divide-[#E0E2E6] overflow-y-auto p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-20 w-20 cursor-pointer after:border-none">
                <AvatarImage src={getAssetUrl(tutor.avatar)} alt={fullName} />
                <AvatarFallback className="bg-[#2563EB] text-sm font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#1E293B]">{fullName}</p>
                <div className="flex flex-wrap items-center gap-1 text-base text-[#565a60]">
                  {tutor.country && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {tutor.country}
                    </span>
                  )}
                  <span>Submitted {submittedOn}</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex cursor-pointer items-center justify-center rounded-full border border-[#2563EB] p-2 text-[#2563EB] hover:bg-[#2563EB] hover:text-white">
                <ThumbsUp className="size-5" />
              </div>
              <Button
                variant="outline"
                className="whitespace-nowrap rounded-full border-[#2563EB] bg-white px-6 py-6 font-medium text-[#2563EB] hover:bg-white/90 hover:text-[#2563EB]/90"
              >
                Message
              </Button>
              <HireProposalAction
                proposalId={proposal.id}
                proposalStatus={proposal.status}
                learnRequestStatus={learnRequestStatus}
                tutorName={fullName}
                onHire={onHire}
                isHiring={isHiring}
              />
            </div>
          </div>
          <div className="flex">
            <div className="flex w-[300px] shrink-0 flex-col border-r border-[#E0E2E6] p-5">
              {sessionPlans.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-bold text-[#143681]">
                      <CalendarCheck className="size-4" />
                      Session plan
                    </p>
                    <span className="text-xs font-semibold text-[#6B7280]">
                      {sessionPlans.length} session{sessionPlans.length > 1 ? 's' : ''} ·{' '}
                      {proposal.sessionDurationMinutes} min each
                    </span>
                  </div>
                  <ol className="rounded-2xl border border-[#E0E2E6] bg-[#FAFAFB] p-5">
                    {visibleSessions.map((session, index) => (
                      <SessionTimelineItem
                        key={session.id}
                        session={session}
                        isLast={index === visibleSessions.length - 1}
                      />
                    ))}
                  </ol>
                  {sessionPlans.length > COLLAPSED_SESSION_COUNT && (
                    <button
                      type="button"
                      onClick={() => setShowAllSessions((prev) => !prev)}
                      className="text-sm font-semibold text-[#2563EB] underline underline-offset-2"
                    >
                      {showAllSessions ? 'Show less' : `Show all ${sessionPlans.length} sessions`}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Proposal Details</h1>
                <div className="flex items-center gap-6">
                  <p className="text-base font-bold">{formatBudget(proposal.totalPrice)} TND</p>
                  <div className="flex items-center gap-2 font-bold">
                    <Wallet className="size-4 text-[#143681]" />
                    <p className="text-base">{PAYOUT_METHOD_LABELS[proposal.payoutMethod]}</p>
                  </div>
                </div>
              </div>

              {proposal.message && (
                <div className="space-y-4">
                  <p className="text-lg font-bold">Cover letter</p>
                  <p className="text-base font-medium text-[#1E293B]">{proposal.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ProposalDetailsSheet
