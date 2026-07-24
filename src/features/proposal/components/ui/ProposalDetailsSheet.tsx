import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ArrowLeft, MapPin, ThumbsUp, Wallet } from 'lucide-react'
import { Proposal } from '../../store/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatBudget, getAssetUrl } from '@/lib/utils'
import { PAYOUT_METHOD_LABELS } from '../../constants/labels'
import { LearnRequestStatus } from '@/features/learn-requests/store/types'
import HireProposalAction from './HireProposalAction'
import { Button } from '@/components/ui/button'
import CoverLetterSection from './ProposalCoverLetterSection'
import ProposalSessionsSection from './ProposalSessionsSection'
import CustomTabToggle from './CustomTabToggle'
import ProposalSessionObjective from './ProposalSessionObjective'
import ReactPlayer from 'react-player/youtube'
import { languageLevelLabels } from '@/lib/Constants'
import { Language } from '@/features/myProfile/store/types'
import SkillChip from '@/features/myProfile/components/ui/Skills/SkillChip'
import SendMessageModal from '@/features/messaging/components/ui/SendMessageModal'
import useGetConversations from '@/features/messaging/hooks/useGetConversations'

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
  const steps = [
    {
      stepNumber: 1,
      component: <CoverLetterSection message={proposal?.message} />,
      show: true,
      name: 'cover letter',
      enabled: true,
    },
    {
      stepNumber: 2,
      component: <ProposalSessionsSection sessions={proposal?.sessionPlans} />,
      show: true,
      name: 'sessions',
      enabled: true,
    },
  ]

  const [detailsSection, setDetailsSection] = useState(1)
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const navigate = useNavigate()
  const { data: conversations } = useGetConversations()

  if (!proposal) return null
  const { tutor } = proposal
  const initials =
    `${tutor.firstname?.charAt(0) ?? ''}${tutor.lastname?.charAt(0) ?? ''}`.toUpperCase()
  const fullName = `${tutor.firstname} ${tutor.lastname.charAt(0)} .`
  const submittedOn = new Date(proposal.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const currentStep = steps.find((step) => step.stepNumber === detailsSection)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent showCloseButton={false} side={'right'} className="min-w-[1020px] !border-0">
          <SheetHeader className="border-b-[0.5px] border-b-[#E0E2E6] p-5">
            <SheetTitle>
              <button type="button" onClick={() => setIsOpen?.(false)} aria-label="Close">
                <ArrowLeft />
              </button>
            </SheetTitle>
          </SheetHeader>
          <div className="no-scrollbar flex flex-col divide-y divide-[#E0E2E6] overflow-y-auto">
            <div className="flex items-center justify-between p-5">
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
                  <Link to={'/'} className="text-sm font-semibold text-[#143681] underline">
                    View profile
                  </Link>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="flex cursor-pointer items-center justify-center rounded-full border border-[#2563EB] p-2 text-[#2563EB] hover:bg-[#2563EB] hover:text-white">
                  <ThumbsUp className="size-5" />
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    const existingConversation = conversations?.find((c) => c.tutorId === tutor.id)
                    if (existingConversation) {
                      navigate(`/messages?conversationId=${existingConversation.id}`)
                    } else {
                      setIsMessageOpen(true)
                    }
                  }}
                  variant="outline"
                  className="whitespace-nowrap rounded-full border-[#2563EB] bg-white px-6 py-6 font-medium text-[#2563EB] hover:bg-blue-50 hover:text-[#2563EB]/90"
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
                <CustomTabToggle
                  selected={detailsSection}
                  setSelected={setDetailsSection}
                  steps={steps}
                />
              </div>
              <div className="w-full space-y-5 p-6">
                <div className="flex w-full items-center justify-between">
                  <h1 className="text-xl font-bold">Proposal Details</h1>
                  <div className="flex items-center gap-6">
                    <p className="text-base font-bold">{formatBudget(proposal.totalPrice)} TND</p>
                    <div className="flex items-center gap-2 font-bold">
                      <Wallet className="size-4 text-[#143681]" />
                      <p className="text-base">{PAYOUT_METHOD_LABELS[proposal.payoutMethod]}</p>
                    </div>
                  </div>
                </div>
                {currentStep?.component || null}
              </div>
            </div>
            <div className="flex">
              <div className="flex w-[300px] shrink-0 flex-col space-y-4 border-r border-[#E0E2E6] p-5">
                {proposal.tutor.tutorProfile?.videoIntroUrl && (
                  <div className="space-y-4">
                    <p className="text-xl font-semibold">Meet {proposal.tutor.firstname}</p>
                    <div className="relative aspect-video overflow-hidden rounded-md">
                      <ReactPlayer
                        url={proposal.tutor.tutorProfile.videoIntroUrl}
                        controls={true}
                        height="100%"
                        width="100%"
                      />
                    </div>
                  </div>
                )}
                {/* Languages */}
                {proposal.tutor.languages && (
                  <div>
                    <p className="text-xl font-semibold">Languages</p>
                    <ul className="mt-2 space-y-0.5">
                      {proposal.tutor.languages.map((lang: Language) => (
                        <li key={lang.language} className="text-sm font-normal text-[#143681]">
                          <span className="font-semibold">{lang.language}</span>:{' '}
                          {languageLevelLabels[lang.level] ?? lang.level}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="divide-y divide-[#E0E2E6]">
                <div className="w-full space-y-5 p-6">
                  <p className="text-2xl font-bold text-[#1E293B]">{proposal.tutor.headline}</p>
                  <ProposalSessionObjective
                    className="text-base font-medium text-[#1E293B]"
                    objective={proposal.tutor.bio}
                  />
                </div>
                {proposal.tutor.tutorProfile?.skills && (
                  <div className="p-6">
                    <p className="text-2xl font-bold text-[#1E293B]">Skills</p>
                    <div className="flex flex-wrap gap-2 p-3">
                      {proposal.tutor.tutorProfile.skills.map(({ skill }) => (
                        <SkillChip key={skill.id} name={skill.name} id={skill.id} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <SendMessageModal open={isMessageOpen} onOpenChange={setIsMessageOpen} recipient={tutor} />
    </>
  )
}

export default ProposalDetailsSheet
