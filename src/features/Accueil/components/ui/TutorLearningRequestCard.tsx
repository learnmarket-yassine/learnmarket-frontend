import { LearnRequest } from '@/features/learn-requests/store/types'
import { useLineClamp } from '@/hooks/useLineClamp'
import { LEVEL_LABELS, TYPE_LABELS, formatLabel } from '@/features/learn-requests/constants/labels'
import SkillsSlider from './SkillsCarousel'
import { CalendarClock, BookOpen } from 'lucide-react'
import { formatBudget } from '@/lib/utils'
import SaveLearnRequestButton from '@/features/learn-requests/components/ui/SaveLearnRequestButton'

export type TutorLearnRequestProps = {
  learnRequest: Partial<LearnRequest>
  onSelect: () => void
}
const DESCRIPTION_LINES = 3

export const TYPE_BADGE_STYLES: Record<string, string> = {
  ONE_TIME: 'bg-[#F3F4F6] text-[#1E293B]',
  COURSE: 'bg-blue-50 text-[#143681]',
}

export const TYPE_ICONS: Record<string, React.ElementType> = {
  ONE_TIME: CalendarClock,
  COURSE: BookOpen,
}

const TutorLearningRequestCard: React.FC<TutorLearnRequestProps> = ({ learnRequest, onSelect }) => {
  const {
    id,
    type,
    title,
    requestedFrequency,
    description,
    skills,
    category,
    budgetMax,
    budgetMin,
    level,
    isSavedByMe,
  } = learnRequest
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
      onClick={onSelect}
      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#143681] hover:shadow-lg"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {type && TypeIcon && (
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${TYPE_BADGE_STYLES[type]}`}
            >
              <TypeIcon className="size-3.5" />
              {typeLabel}
            </span>
          )}
          <div className="flex items-center gap-3">
            <p className="text-sm text-[#6B7280]">posted 1 hour ago</p>
            {id && <SaveLearnRequestButton learnRequestId={id} isSaved={!!isSavedByMe} />}
          </div>
        </div>

        <h3 className="truncate text-xl font-bold leading-snug text-[#143681] hover:underline">
          {title}
        </h3>
        <p className="flex items-center gap-1 text-sm text-[#6B7280]">
          {meta} · <span>budget</span>: ${formatBudget(budgetMin)} - ${formatBudget(budgetMax)}
        </p>
        <div>
          <p
            ref={descriptionRef}
            className={`${clampClassName} text-base font-medium text-[#1E293B]`}
          >
            {description}
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
        <div onClick={(e) => e.stopPropagation()}>
          <SkillsSlider skills={skills} />
        </div>
      </div>
    </div>
  )
}

export default TutorLearningRequestCard
