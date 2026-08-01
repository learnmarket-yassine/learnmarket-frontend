import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { DatePickerField } from '@/components/ui/date-picker-field'
import { isRichTextEmpty } from '@/lib/richText'
import EditButton from '@/features/myProfile/components/ui/EditButton'
import { Assignment } from '@/features/scheduling/types/dto'
import { AssignmentFormData, AssignmentSchema } from '../../schemas'
import useCreateAssignment from '../../hooks/useCreateAssignment'
import useUpdateAssignment from '../../hooks/useUpdateAssignment'
import PlusIcon from '@/assets/PlusIcon'
import FileUpload from '@/components/ui/FileUploader'

type AssignmentModalProps = {
  sessionId: string
  assignment?: Assignment
}

function AssignmentModal({ sessionId, assignment }: AssignmentModalProps) {
  const isEditMode = !!assignment
  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(AssignmentSchema),
    defaultValues: {
      title: assignment?.title ?? '',
      instructions: assignment?.instructions ?? '',
      dueAt: assignment?.dueAt ? assignment.dueAt.slice(0, 10) : '',
    },
  })
  const { handleSubmit, register, reset, control, formState } = form

  const { handleCreate, isPending: isCreating } = useCreateAssignment(sessionId)
  const { handleUpdate, isPending: isUpdating } = useUpdateAssignment(sessionId)
  const isPending = isCreating || isUpdating

  useEffect(() => {
    if (isOpen) {
      reset({
        title: assignment?.title ?? '',
        instructions: assignment?.instructions ?? '',
        dueAt: assignment?.dueAt ? assignment.dueAt.slice(0, 10) : '',
      })
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFiles([])
    }
  }, [isOpen, reset, assignment])

  const onSubmit: SubmitHandler<AssignmentFormData> = async (data) => {
    const instructions =
      data.instructions && !isRichTextEmpty(data.instructions) ? data.instructions : undefined
    if (isEditMode) {
      await handleUpdate({
        title: data.title,
        instructions,
        dueAt: data.dueAt || undefined,
        files,
      })
    } else {
      await handleCreate({
        title: data.title,
        instructions,
        dueAt: data.dueAt || undefined,
        files,
      })
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <EditButton label="Edit Assignment" />
        ) : (
          <Button
            type="button"
            aria-label="Create Announcement"
            className={`h-full border border-[#2563EB] bg-[#2563EB] p-3 text-white hover:bg-[#2563EB]`}
          >
            <PlusIcon className="size-4 text-white" />
            <span>New Assingnment</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="flex w-[400px] flex-col space-y-6 sm:w-[425px] sm:min-w-[600px]"
        style={{
          boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex w-full items-center justify-between">
              <span className="text-2xl font-bold text-[#143681]">
                {isEditMode ? 'Edit Assignment' : 'New Assignment'}
              </span>
              <button type="button" onClick={() => setIsOpen(false)}>
                <X className="size-9" />
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-1 flex-col gap-5 overflow-hidden"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(onSubmit)(e)
          }}
          noValidate
        >
          <div className="flex-1 space-y-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
              <Label className="text-base">Title</Label>
              <Input
                {...register('title')}
                placeholder="e.g. Practice worksheet #1"
                className={`border-[0.5px] ${formState.errors.title ? 'border-red-600' : 'border-[#9CA3AF]'}`}
              />
              {formState.errors.title && (
                <p className="text-xs text-red-600">{formState.errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-base">Instructions</Label>
              <Controller
                name="instructions"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="What should the learner do?"
                    className="border-[0.5px] border-[#9CA3AF]"
                    contentClassName="min-h-[120px]"
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-base">Due date (optional)</Label>
              <Controller
                name="dueAt"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Select a due date"
                    fromDate={new Date()}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FileUpload
                accept={['application/pdf']}
                maxSizeMB={25}
                resetAfterUpload
                uploadFn={(file) => Promise.resolve(file)}
                onUploaded={(file) => setFiles((prev) => [...prev, file])}
              />
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
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? 'Saving…' : isEditMode ? 'Save changes' : 'Create assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AssignmentModal
