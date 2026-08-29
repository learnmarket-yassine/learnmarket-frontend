import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RichTextContent } from '@/components/ui/rich-text-content'
import { isObjectiveFilled } from '@/features/proposal/utils/sessionPlan'
import DeleteButton from '@/features/myProfile/components/ui/DeleteButton'
import ConfirmModal from '@/components/layout/ConfirmModal'
import EditButton from '@/features/myProfile/components/ui/EditButton'

type SessionRowProps = {
  position: number
  index: number
  id?: string
  title: string
  objective?: string
  isOpen: boolean
  canDelete: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

const SessionRow = ({
  position,
  index,
  id,
  title,
  objective,
  isOpen,
  canDelete,
  onToggle,
  onEdit,
  onDelete,
}: SessionRowProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean | null>(false)
  const isPersisted = !!id
  const hasObjective = isObjectiveFilled(objective)

  const headerId = `session-header-${index}`
  const panelId = `session-panel-${index}`

  const handleHeaderKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onToggle()
    }
  }

  return (
    <div className="rounded-xl border border-[#E5E7EB]">
      <div
        id={headerId}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={handleHeaderKeyDown}
        className="flex cursor-pointer items-start gap-3 px-4 py-3"
      >
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
          {position}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#1E293B]">
            {title || 'Untitled session'}
          </p>
          {!isOpen &&
            (hasObjective ? (
              <RichTextContent html={objective ?? ''} className="mt-1 line-clamp-3" />
            ) : (
              <p className="mt-1 text-sm italic text-[#9CA3AF]">No objective set</p>
            ))}
        </div>
        <div className="flex items-center justify-end gap-4">
          <EditButton label={`Edit session ${position}`} onClick={onEdit} />
          {canDelete &&
            (isPersisted ? (
              <ConfirmModal
                name={`remove-session-${id}`}
                type="delete"
                title="Remove this session?"
                description={`Session ${position} and its objective will be removed from this proposal. This is only saved once you click "Save changes."`}
                isOpen={!!isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                handleConfirm={() => {
                  onDelete()
                  setIsDeleteOpen(false)
                }}
              />
            ) : (
              <DeleteButton onClick={onDelete} label={`Remove session ${position}`} />
            ))}
          <ChevronDown
            className={cn(
              'mt-0.5 size-4 shrink-0 text-[#8E949F] transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>
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
          <div className="space-y-4 border-t border-[#E5E7EB] px-4 py-4">
            {hasObjective ? (
              <RichTextContent html={objective ?? ''} />
            ) : (
              <p className="text-sm italic text-[#9CA3AF]">No objective set</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionRow
