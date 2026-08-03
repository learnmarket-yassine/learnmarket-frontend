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
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import EditButton from '@/features/myProfile/components/ui/EditButton'
import PlusIcon from '@/assets/PlusIcon'
import { Announcement } from '@/features/scheduling/types/dto'
import { CreateAnnouncementFormData, CreateAnnouncementSchema } from '../../schemas'
import useCreateAnnouncement from '../../hooks/useCreateAnnouncement'
import useUpdateAnnouncement from '../../hooks/useUpdateAnnouncement'
import FileUpload from '@/components/ui/FileUploader'

type AnnouncementModalProps = {
  sessionId: string
  announcement?: Announcement
}

function AnnouncementModal({ sessionId, announcement }: AnnouncementModalProps) {
  const isEditMode = !!announcement
  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const form = useForm<CreateAnnouncementFormData>({
    resolver: zodResolver(CreateAnnouncementSchema),
    defaultValues: { content: announcement?.content ?? '' },
  })
  const { handleSubmit, reset, control, formState } = form

  const { handleCreate, isPending: isCreating } = useCreateAnnouncement(sessionId)
  const { handleUpdate, isPending: isUpdating } = useUpdateAnnouncement(sessionId)
  const isPending = isCreating || isUpdating

  useEffect(() => {
    if (isOpen) {
      reset({ content: announcement?.content ?? '' })
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFiles([])
    }
  }, [isOpen, reset, announcement])

  const onSubmit: SubmitHandler<CreateAnnouncementFormData> = async (data) => {
    if (isEditMode) {
      await handleUpdate({ announcementId: announcement.id, content: data.content, files })
    } else {
      await handleCreate({ content: data.content, files })
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <EditButton label="Edit Announcement" />
        ) : (
          <Button
            type="button"
            aria-label="Create Announcement"
            className={`h-full border border-[#2563EB] p-3 text-[#2563EB]`}
          >
            <PlusIcon className="size-4 text-[#2563EB]" />
            <span>Create Announcement</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="flex w-[400px] flex-col sm:w-[425px] sm:min-w-[600px]"
        style={{
          boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex w-full items-center justify-between">
              <span className="text-2xl text-[#143681]">
                {isEditMode ? 'Edit Announcement' : 'Create Announcement'}
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
              <Label className="text-base">Message</Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Share an update with the class…"
                    className="border-[0.5px] border-[#9CA3AF]"
                    contentClassName="min-h-[120px]"
                    error={formState.errors.content?.message}
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
              {isPending ? 'Saving…' : isEditMode ? 'Save changes' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AnnouncementModal
