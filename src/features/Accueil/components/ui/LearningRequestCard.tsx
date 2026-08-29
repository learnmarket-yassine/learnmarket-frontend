import { LearnRequest } from '@/features/learn-requests/store/types'
import { RichTextContent } from '@/components/ui/rich-text-content'
import { useLineClamp } from '@/hooks/useLineClamp'
import SkillsSlider from './SkillsCarousel'
import { formatLabel, LEVEL_LABELS, TYPE_LABELS } from '@/features/learn-requests/constants/labels'
import { TYPE_BADGE_STYLES, TYPE_ICONS } from './TutorLearningRequestCard'
import { formatBudget } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

export type LearnRequestPreview = Partial<LearnRequest>

const DESCRIPTION_LINES = 3

const formatStatus = (status?: string) => {
  if (!status) return ''
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const LearnRequestCard: React.FC<LearnRequestPreview> = ({
  id,
  status,
  type,
  level,
  category,
  title,
  budgetMax,
  budgetMin,
  description,
  requestedFrequency,
  skills,
}) => {
  const navigate = useNavigate()
  const {
    ref: descriptionRef,
    isExpanded,
    isClampable,
    toggle,
    className: clampClassName,
  } = useLineClamp(description, { lines: DESCRIPTION_LINES })

  const meta = [category?.name ?? 'Uncategorized', formatLabel(LEVEL_LABELS, level)]
    .filter(Boolean)
    .join(' · ')

  const TypeIcon = type ? TYPE_ICONS[type] : undefined
  const typeLabel =
    type === 'COURSE' && requestedFrequency
      ? `${formatLabel(TYPE_LABELS, type)} · ${requestedFrequency}x/week`
      : formatLabel(TYPE_LABELS, type)

  return (
    <div
      onClick={() => {
        navigate(`/learn-requests/${id}`)
      }}
      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#143681] hover:shadow-lg"
    >
      <div className="space-y-4">
        <p className="px-2 text-sm text-[#6B7280]">posted 1 hour ago</p>
        <div className="flex items-center justify-between">
          {type && TypeIcon && (
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${TYPE_BADGE_STYLES[type]}`}
            >
              <TypeIcon className="size-3.5" />
              {typeLabel}
            </span>
          )}

          <span className={`flex items-center gap-1.5 text-xs font-semibold`}>
            {formatStatus(status)}
          </span>
        </div>
        <h3 className="truncate text-xl font-bold leading-snug text-[#143681] hover:underline">
          {title}
        </h3>
        <p className="flex items-center gap-1 text-sm text-[#6B7280]">
          {meta} · <span>budget</span>: ${formatBudget(budgetMin)} - ${formatBudget(budgetMax)}
        </p>
        <div>
          <RichTextContent
            ref={descriptionRef}
            html={description ?? ''}
            className={`${clampClassName} text-base font-medium text-[#1E293B]`}
          />
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
        <div onClick={(e) => e.stopPropagation()} className="relative">
          <SkillsSlider skills={skills} />
        </div>
      </div>
    </div>
  )
}

export default LearnRequestCard
