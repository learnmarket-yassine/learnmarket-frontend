import { useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export type ReorderableSession = {
  fieldId: string
  id?: string
  title: string
  objective?: string
}

type SessionReorderModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessions: ReorderableSession[]
  onSave: (order: ReorderableSession[]) => void
}

type ReorderRowProps = {
  session: ReorderableSession
  index: number
  total: number
  onMoveUp: () => void
  onMoveDown: () => void
}

const ReorderRow = ({ session, index, total, onMoveUp, onMoveDown }: ReorderRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: session.fieldId,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5',
        isDragging && 'z-10 shadow-md'
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-[#8E949F] active:cursor-grabbing"
        aria-label={`Drag session ${index + 1}`}
      >
        <GripVertical className="size-4" />
      </button>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
        {index + 1}
      </span>
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-[#1E293B]">
        {session.title || 'Untitled session'}
      </p>
      <div className="flex shrink-0 flex-col">
        <button
          type="button"
          disabled={index === 0}
          onClick={onMoveUp}
          aria-label={`Move session ${index + 1} up`}
          className="text-[#8E949F] disabled:opacity-30"
        >
          <ChevronUp className="size-4" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={onMoveDown}
          aria-label={`Move session ${index + 1} down`}
          className="text-[#8E949F] disabled:opacity-30"
        >
          <ChevronDown className="size-4" />
        </button>
      </div>
    </div>
  )
}

type SessionReorderBodyProps = Omit<SessionReorderModalProps, 'open'>

// Only mounted while the dialog is open, so the draft always initializes
// fresh from the current order; real form state is only touched by
// handleSave, so Cancel / backdrop click leaves the source order intact.
const SessionReorderBody = ({ onOpenChange, sessions, onSave }: SessionReorderBodyProps) => {
  const [draft, setDraft] = useState<ReorderableSession[]>(sessions)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    setDraft((current) => {
      const oldIndex = current.findIndex((item) => item.fieldId === active.id)
      const newIndex = current.findIndex((item) => item.fieldId === over.id)
      if (oldIndex === -1 || newIndex === -1) return current
      return arrayMove(current, oldIndex, newIndex)
    })
  }

  const moveItem = (index: number, direction: -1 | 1) => {
    setDraft((current) => {
      const target = index + direction
      if (target < 0 || target >= current.length) return current
      return arrayMove(current, index, target)
    })
  }

  const handleSave = () => {
    onSave(draft)
    onOpenChange(false)
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Reorder sessions</DialogTitle>
      </DialogHeader>
      <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={draft.map((item) => item.fieldId)}
            strategy={verticalListSortingStrategy}
          >
            {draft.map((item, index) => (
              <ReorderRow
                key={item.fieldId}
                session={item}
                index={index}
                total={draft.length}
                onMoveUp={() => moveItem(index, -1)}
                onMoveDown={() => moveItem(index, 1)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <DialogFooter className="w-full justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
          onClick={handleSave}
        >
          Save order
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

const SessionReorderModal = ({
  open,
  onOpenChange,
  sessions,
  onSave,
}: SessionReorderModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <SessionReorderBody onOpenChange={onOpenChange} sessions={sessions} onSave={onSave} />
      )}
    </Dialog>
  )
}

export default SessionReorderModal
