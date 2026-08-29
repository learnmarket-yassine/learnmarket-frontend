import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { RichTextContent } from '@/components/ui/rich-text-content'
import { ProposalSessionPlan } from '../../store/types'

type ProposalSessionCardProps = {
  position: number
  session: ProposalSessionPlan
  durationLabel?: string | null
  isOpen: boolean
  onToggle: () => void
}

const ProposalSessionCard = ({
  position,
  session,
  durationLabel,
  isOpen,
  onToggle,
}: ProposalSessionCardProps) => {
  const hasObjective = !!session.objective && session.objective.trim().length > 0
  const headerId = `proposal-session-header-${session.id}`
  const panelId = `proposal-session-panel-${session.id}`

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onToggle()
    }
  }

  return (
    <div className="rounded-xl border border-[#E0E2E6]">
      <div
        id={headerId}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className="flex cursor-pointer items-start gap-3 px-4 py-3"
      >
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
          {position}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-[#1E293B]">
              {session.title || 'Untitled session'}
            </p>
            {durationLabel && (
              <span className="shrink-0 rounded-full bg-[#F5F6F7] px-2 py-0.5 text-xs font-medium text-[#565A60]">
                {durationLabel}
              </span>
            )}
          </div>
          {!isOpen &&
            (hasObjective ? (
              <RichTextContent html={session.objective ?? ''} className="mt-1 line-clamp-2" />
            ) : (
              <p className="mt-1 text-sm italic text-[#9CA3AF]">No objective provided</p>
            ))}
        </div>
        <ChevronDown
          className={cn(
            'mt-0.5 size-4 shrink-0 text-[#8E949F] transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </div>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {isOpen && (
          <div className="border-t border-[#E0E2E6] px-4 py-4">
            {hasObjective ? (
              <RichTextContent html={session.objective ?? ''} />
            ) : (
              <p className="text-sm italic text-[#9CA3AF]">No objective provided</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProposalSessionCard
