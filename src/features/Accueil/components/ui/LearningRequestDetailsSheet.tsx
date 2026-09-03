import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { RichTextContent } from '@/components/ui/rich-text-content'
import { formatLabel, LEVEL_LABELS, TYPE_LABELS } from '@/features/learn-requests/constants/labels'
import { LearnRequest } from '@/features/learn-requests/store/types'
import { formatBudget, cn } from '@/lib/utils'
import { ArrowLeft, GraduationCap, Heart, Tag, Wallet } from 'lucide-react'
import { TYPE_BADGE_STYLES, TYPE_ICONS } from './TutorLearningRequestCard'
import SkillChip from '@/features/myProfile/components/ui/Skills/SkillChip'
import LanguagesIcon from '@/assets/LanguagesIcon'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import useToggleSavedLearnRequest from '@/features/learn-requests/hooks/useToggleSavedLearnRequest'
import { useStore } from '@/store/store'

type LearningRequestDetailsSheetProps = {
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  request: LearnRequest | null
}

const LearningRequestDetailsSheet: React.FC<LearningRequestDetailsSheetProps> = ({
  isOpen,
  setIsOpen,
  request,
}) => {
  const user = useStore((state) => state.auth.user)
  const isNotVerified =
    user?.tutorProfile?.verificationStatus && user?.tutorProfile?.verificationStatus !== 'APPROVED'
  const navigate = useNavigate()
  const toggleSaved = useToggleSavedLearnRequest(request?.id ?? '')

  if (!request) return null
  const TypeIcon = request.type ? TYPE_ICONS[request.type] : undefined
  const typeLabel =
    request.type === 'COURSE' && request.requestedFrequency
      ? `${formatLabel(TYPE_LABELS, request.type)} · ${request.requestedFrequency}x/week`
      : formatLabel(TYPE_LABELS, request.type)
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent showCloseButton={false} side={'right'} className="min-w-[1020px] !border-0">
        <SheetHeader className="border-b-[0.5px] border-b-[#E0E2E6] p-8">
          <SheetTitle>
            <button type="button" onClick={() => setIsOpen?.(false)} aria-label="Close">
              <ArrowLeft />
            </button>
          </SheetTitle>
        </SheetHeader>
        <div className="no-scrollbar flex overflow-y-auto">
          <div>
            <div className="flex flex-1 flex-col space-y-5 border-b-[0.5px] border-b-[#E0E2E6] p-8">
              <h1 className="text-2xl font-medium">{request.title}</h1>
              <div className="flex items-center justify-between">
                {request.type && TypeIcon && (
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${TYPE_BADGE_STYLES[request.type]}`}
                  >
                    <TypeIcon className="size-3.5" />
                    {typeLabel}
                  </span>
                )}
                <span className="text-sm font-[450]">
                  Posted{' '}
                  {new Date(request.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <div className="border-b-[0.5px] border-b-[#E0E2E6] p-8">
              <RichTextContent
                html={request.description ?? ''}
                className="text-base font-medium text-[#1E293B]"
              />
            </div>
            <div className="flex items-center justify-around border-b-[0.5px] border-b-[#E0E2E6] p-8">
              <div className="flex flex-col items-center gap-2 text-lg">
                <span className="flex items-center gap-2 text-sm font-bold text-[#143681]">
                  <Wallet className="size-4" />
                  BUDGET RANGE
                </span>
                <span className="text-base font-semibold">
                  {formatBudget(request.budgetMin)} - {formatBudget(request.budgetMax)} USD
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-lg">
                <span className="flex items-center gap-1 text-sm font-bold text-[#143681]">
                  <GraduationCap className="size-5" />
                  CURRENT LEVEL
                </span>
                <span className="text-base font-semibold">
                  {formatLabel(LEVEL_LABELS, request.level)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-lg">
                <span className="flex items-center gap-2 text-sm font-bold text-[#143681]">
                  <Tag className="size-4" />
                  CATEGORY
                </span>
                <span className="text-base font-semibold">
                  {request.category?.name ?? 'Uncategorized'}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 border-b-[0.5px] border-b-[#E0E2E6] p-8">
              <h3 className="text-lg font-semibold text-[#143681]">Skills</h3>
              <div className="flex max-h-[250px] flex-wrap gap-2 overflow-auto rounded-lg p-3">
                {request.skills.length === 0 ? (
                  <p className="italic text-gray-400">Not set</p>
                ) : (
                  request.skills.map(({ skill }) => <SkillChip key={skill.id} name={skill.name} />)
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 p-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <LanguagesIcon /> Preferred Languages :
              </h3>
              {request.preferredLanguages.length === 0 ? (
                <p className="italic">Not set</p>
              ) : (
                <p className="text-lg">{request.preferredLanguages.join(', ')}</p>
              )}
            </div>
          </div>

          <div className="flex w-[300px] shrink-0 flex-col border-l border-[#E0E2E6] p-8">
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                disabled={request.proposals && request.proposals.length > 0}
                onClick={() => navigate(`/proposals/${request.id}/create`) || isNotVerified}
                className="w-full whitespace-nowrap rounded-full bg-[#2563EB] py-6 font-medium text-white hover:bg-[#2563EB] disabled:cursor-not-allowed"
              >
                Apply now
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toggleSaved.mutate(!!request.isSavedByMe)}
                className="group flex w-full items-center gap-3 whitespace-nowrap rounded-full border-[#2563EB] bg-white py-6 font-medium text-[#2563EB] hover:bg-white/90 hover:text-[#2563EB]/90"
              >
                <Heart
                  className={cn(
                    'size-5 transition group-hover:scale-110',
                    request.isSavedByMe && 'fill-current'
                  )}
                />
                {request.isSavedByMe ? 'Saved' : 'Save request'}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default LearningRequestDetailsSheet
