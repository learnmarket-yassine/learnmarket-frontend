import { useState } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import useCreateAssignment from '../../hooks/useCreateAssignment'
import useUpdateAssignment from '../../hooks/useUpdateAssignment'
import { Assignment } from '@/features/scheduling/types/dto'

interface CreateAssignmentPanelProps {
  sessionId: string
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  assignment?: Assignment
}

const CreateAssignmentPanel = ({
  sessionId,
  isOpen,
  setIsOpen,
  assignment,
}: CreateAssignmentPanelProps) => {
  const isEditMode = !!assignment
  const [title, setTitle] = useState(assignment?.title ?? '')
  const [instructions, setInstructions] = useState(assignment?.instructions ?? '')
  const [dueAt, setDueAt] = useState(assignment?.dueAt ? assignment.dueAt.slice(0, 10) : '')
  const [files, setFiles] = useState<File[]>([])

  const { handleCreate, isPending: isCreating } = useCreateAssignment(sessionId)
  const { handleUpdate, isPending: isUpdating } = useUpdateAssignment(sessionId)

  const isPending = isCreating || isUpdating

  const resetAndClose = () => {
    setFiles([])
    setIsOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    if (isEditMode) {
      await handleUpdate({
        title: title.trim(),
        instructions: instructions.trim() || undefined,
        dueAt: dueAt || undefined,
      })
    } else {
      await handleCreate({
        title: title.trim(),
        instructions: instructions.trim() || undefined,
        dueAt: dueAt || undefined,
        files,
      })
    }
    resetAndClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent showCloseButton={false} side="right" className="min-w-[520px] !border-0">
        <SheetHeader className="border-b-[0.5px] border-b-[#E0E2E6] p-5">
          <SheetTitle>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close">
              <ArrowLeft />
            </button>
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-[#1E293B]">
            {isEditMode ? 'Edit assignment' : 'Create assignment'}
          </h1>

          <div className="space-y-2">
            <Label htmlFor="assignment-title" className="text-sm font-semibold text-[#374151]">
              Title
            </Label>
            <Input
              id="assignment-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Practice worksheet #1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="assignment-instructions"
              className="text-sm font-semibold text-[#374151]"
            >
              Instructions
            </Label>
            <Textarea
              id="assignment-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="h-[140px] resize-none rounded-xl border border-[#6B7280] bg-white p-4"
              placeholder="What should the learner do?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignment-due-date" className="text-sm font-semibold text-[#374151]">
              Due date (optional)
            </Label>
            <Input
              id="assignment-due-date"
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
            />
          </div>

          {!isEditMode && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#374151]">
                Reference attachment (optional)
              </Label>
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#D1D5DB] p-4 text-sm text-[#6B7280] hover:border-[#2563EB]">
                <span>Click to attach a file</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                />
              </label>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map((file, idx) => (
                    <span
                      key={`${file.name}-${idx}`}
                      className="flex items-center gap-1 rounded-full bg-[#F3F4F6] px-3 py-1 text-xs text-[#374151]"
                    >
                      {file.name}
                      <button
                        type="button"
                        onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                        aria-label="Remove file"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-auto flex justify-end gap-3 border-t border-[#E0E2E6] pt-4">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full px-6 py-3 font-medium text-[#1A46A7]"
              onClick={resetAndClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isPending}
              className="rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? 'Saving…' : isEditMode ? 'Save changes' : 'Create assignment'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default CreateAssignmentPanel
