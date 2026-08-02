import LanguagesIcon from '@/assets/LanguagesIcon'
import {
  TYPE_BADGE_STYLES,
  TYPE_ICONS,
} from '@/features/Accueil/components/ui/TutorLearningRequestCard'
import { formatLabel, LEVEL_LABELS, TYPE_LABELS } from '@/features/learn-requests/constants/labels'
import { LearnRequest } from '@/features/learn-requests/store/types'
import SkillChip from '@/features/myProfile/components/ui/Skills/SkillChip'
import useLineClamp from '@/hooks/useLineClamp'
import { formatBudget } from '@/lib/utils'
import { GraduationCap, Tag, Wallet } from 'lucide-react'
import React from 'react'

type ProposalLearnRequestDetailsCardProps = {
  learnrequest: LearnRequest
}

const DESCRIPTION_LINES = 3

const ProposalLearnRequestDetailsCard: React.FC<ProposalLearnRequestDetailsCardProps> = ({
  learnrequest,
}) => {
  const {
    ref: descriptionRef,
    isExpanded,
    isClampable,
    toggle,
    className: clampClassName,
  } = useLineClamp(learnrequest?.description, { lines: DESCRIPTION_LINES })

  const typeLabel =
    learnrequest.type === 'COURSE' && learnrequest.requestedFrequency
      ? `${formatLabel(TYPE_LABELS, learnrequest.type)} · ${learnrequest.requestedFrequency}x/week`
      : formatLabel(TYPE_LABELS, learnrequest.type)

  const TypeIcon = learnrequest.type ? TYPE_ICONS[learnrequest.type] : undefined

  return (
    <div className="flex flex-col space-y-4 p-5">
      <h3 className="text-xl font-bold">Learn Request Details</h3>
      <div className="divide-y divide-[#E0E2E6]">
        <div className="flex overflow-y-auto">
          <div className="flex-1 space-y-5 pb-5 pr-5">
            <h1 className="text-lg font-semibold">{learnrequest?.title}</h1>
            <div className="flex items-center gap-3">
              {learnrequest.type && TypeIcon && (
                <span
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${TYPE_BADGE_STYLES[learnrequest.type]}`}
                >
                  <TypeIcon className="size-3.5" />
                  {typeLabel}
                </span>
              )}
              <p>Posted Jul 21, 2026</p>
            </div>
            <div>
              <p
                ref={descriptionRef}
                className={`${clampClassName} text-base font-medium text-[#1E293B]`}
              >
                {learnrequest.description}
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
            <div className="flex items-center gap-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <LanguagesIcon /> Preferred Languages :
              </h3>
              {learnrequest.preferredLanguages.length === 0 ? (
                <p className="italic">Not set</p>
              ) : (
                <p className="text-lg">{learnrequest.preferredLanguages.join(', ')}</p>
              )}
            </div>
          </div>
          <div className="flex w-[300px] shrink-0 flex-col border-l border-[#E0E2E6] p-8">
            <div className="space-y-4">
              <div className="flex items-start gap-6 text-lg">
                <GraduationCap className="size-6 text-[#143681]" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold">
                    {formatLabel(LEVEL_LABELS, learnrequest.level)}
                  </span>
                  <span className="text-xs font-semibold text-[#6B7280]">Cuurent level</span>
                </div>
              </div>
              <div className="flex items-start gap-6 text-lg">
                <Wallet className="size-5 text-[#143681]" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold">
                    {formatBudget(learnrequest.budgetMin)} - {formatBudget(learnrequest.budgetMax)}{' '}
                    USD
                  </span>
                  <span className="text-xs font-semibold text-[#6B7280]">Budget range</span>
                </div>
              </div>
              <div className="flex items-start gap-6 text-lg">
                <Tag className="size-5 text-[#143681]" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold">
                    {learnrequest.category?.name ?? 'Uncategorized'}
                  </span>
                  <span className="text-xs font-semibold text-[#6B7280]">Category</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4 py-5">
          <h3 className="text-xl font-bold">Skills and expertise</h3>
          <div className="flex flex-wrap gap-2 p-3">
            {learnrequest?.skills && learnrequest?.skills?.length === 0 ? (
              <p className="italic text-gray-400">Not set</p>
            ) : (
              learnrequest?.skills?.map(({ skill }) => (
                <SkillChip key={skill.id} name={skill.name} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalLearnRequestDetailsCard
