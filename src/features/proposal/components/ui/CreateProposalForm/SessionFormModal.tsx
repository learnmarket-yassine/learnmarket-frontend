import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

export type SessionFormValues = {
  title: string
  objective: string
}

type SessionFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'add' | 'edit'
  sessionNumber?: number
  initialTitle?: string
  initialObjective?: string
  onSave: (values: SessionFormValues) => void
}

type SessionFormBodyProps = Omit<SessionFormModalProps, 'open'>

const SessionFormBody = ({
  onOpenChange,
  mode,
  sessionNumber,
  initialTitle = '',
  initialObjective = '',
  onSave,
}: SessionFormBodyProps) => {
  const [title, setTitle] = useState(initialTitle)
  const [objective, setObjective] = useState(initialObjective)
  const [titleError, setTitleError] = useState<string | null>(null)

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError('Session title is required')
      return
    }
    onSave({ title: title.trim(), objective })
    onOpenChange(false)
  }

  return (
    <DialogContent
      className="flex max-h-[85vh] w-[400px] flex-col overflow-y-auto sm:w-[425px] sm:min-w-[650px]"
      style={{
        boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
      }}
    >
      <DialogHeader>
        <DialogTitle>
          {mode === 'add' ? 'Add session' : `Edit session ${sessionNumber ?? ''}`}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-5 py-2">
        <div className="space-y-1.5">
          <Label htmlFor="session-modal-title" className="text-sm font-semibold text-[#374151]">
            Title
          </Label>
          <Input
            id="session-modal-title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (titleError) setTitleError(null)
            }}
            placeholder="e.g. Introduction to variables"
            autoFocus
          />
          {titleError && <p className="text-xs text-destructive">{titleError}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-[#374151]">Objective (optional)</Label>
          <RichTextEditor
            value={objective}
            onChange={setObjective}
            placeholder="What the learner should be able to do after this session"
            contentClassName="min-h-[120px]"
          />
        </div>
      </div>
      <div className="flex w-full justify-end gap-2">
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
          Save
        </Button>
      </div>
    </DialogContent>
  )
}

const SessionFormModal = ({ open, onOpenChange, ...bodyProps }: SessionFormModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <SessionFormBody onOpenChange={onOpenChange} {...bodyProps} />}
    </Dialog>
  )
}

export default SessionFormModal
