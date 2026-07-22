import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThumbsUp, Wallet } from 'lucide-react'
import SkillsSlider from '@/features/Accueil/components/ui/SkillsCarousel'
import { formatBudget, getAssetUrl } from '@/lib/utils'
import { PAYOUT_METHOD_LABELS } from '@/features/proposal/constants/labels'
import { Proposal } from '@/features/proposal/store/types'
import { LearnRequestStatus } from '@/features/learn-requests/store/types'
import useLineClamp from '@/hooks/useLineClamp'
import HireProposalAction from '@/features/proposal/components/ui/HireProposalAction'
import { Button } from '@/components/ui/button'

type LearnRequestProposalCardProps = {
  proposal: Proposal
  learnRequestStatus: LearnRequestStatus
  onHire: (proposalId: string) => void
  isHiring: boolean
  onSelect: () => void
}

const DESCRIPTION_LINES = 3

const LearnRequestProposalCard = ({
  proposal,
  learnRequestStatus,
  onHire,
  isHiring,
  onSelect,
}: LearnRequestProposalCardProps) => {
  const { tutor } = proposal

  const initials =
    `${tutor.firstname?.charAt(0) ?? ''}${tutor.lastname?.charAt(0) ?? ''}`.toUpperCase()
  const fullName = `${tutor.firstname} ${tutor.lastname}`

  const {
    ref: descriptionRef,
    isExpanded,
    isClampable,
    toggle,
    className: clampClassName,
  } = useLineClamp(proposal.message, { lines: DESCRIPTION_LINES })

  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#143681] hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20 cursor-pointer after:border-none">
          <AvatarImage src={getAssetUrl(tutor.avatar)} alt={fullName} />
          <AvatarFallback className="bg-[#2563EB] text-sm font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{fullName}</p>
                {tutor.headline && <p className="text-sm font-bold">{tutor.headline}</p>}
                {tutor.country && <span className="text-sm">{tutor.country}</span>}
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
          <div className="flex items-center gap-6">
            <p className="text-sm font-bold">{formatBudget(proposal.totalPrice)} TND</p>
            <div className="flex items-center gap-2 font-bold">
              <Wallet className="size-4 text-[#143681]" />
              <p className="text-sm">{PAYOUT_METHOD_LABELS[proposal.payoutMethod]}</p>
            </div>
          </div>
          <div>
            <p
              ref={descriptionRef}
              className={`${clampClassName} text-base font-medium text-[#1E293B]`}
            >
              {proposal.message}
            </p>
            {isClampable && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggle()
                }}
                className="text-sm font-semibold text-[#565A60] underline"
              >
                {isExpanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
          <SkillsSlider skills={tutor.tutorProfile?.skills} />
        </div>
      </div>
    </div>
  )
}

export default LearnRequestProposalCard
