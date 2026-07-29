import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { FileText, Trash2, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CustomInput } from '@/components/ui/CustomInput'
import { DatePickerField } from '@/components/ui/date-picker-field'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useDownloadClassroomAttachment from '@/features/sessions/hooks/useDownloadClassroomAttachment'
import { useStore } from '@/store/store'
import { CertificationFormData, certificationSchema } from '../../schemas'
import useCreateCertification from '../../hooks/useCreateCertification'
import useEditCertification from '../../hooks/useEditCertification'
import useDeleteCertificationFile from '../../hooks/useDeleteCertificationFile'
import useUploadCertificationFile, {
  uploadCertificationFile,
} from '../../hooks/useUploadCertificationFile'
import EditButton from './EditButton'
import AddButton from './AddButton'

type CertificationFormProps = {
  edit: boolean
  id?: string
}

const EMPTY_VALUES: CertificationFormData = {
  title: '',
  issuer: '',
  issuedAt: '',
  expiresAt: '',
  credentialUrl: '',
}

function CertificationForm({ edit, id }: CertificationFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [isUploadingPending, setIsUploadingPending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const { mutateAsync: createCertification, isPending: createLoading } = useCreateCertification()
  const { mutateAsync: editCertification, isPending: editLoading } = useEditCertification()
  const { handleDownload } = useDownloadClassroomAttachment()
  const { handleUpload: uploadToExisting, isPending: isUploadingToExisting } =
    useUploadCertificationFile(id ?? '')
  const { handleDelete: deleteExistingFile } = useDeleteCertificationFile(id ?? '')

  const user = useStore((state) => state.auth.user)
  const selectedCertification = (user?.tutorProfile?.certifications ?? []).find(
    (certification) => certification.id === id
  )

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (!isOpen) return
    if (edit && selectedCertification) {
      reset({
        title: selectedCertification.title,
        issuer: selectedCertification.issuer,
        issuedAt: selectedCertification.issuedAt ?? '',
        expiresAt: selectedCertification.expiresAt ?? '',
        credentialUrl: selectedCertification.credentialUrl ?? '',
      })
    } else {
      reset(EMPTY_VALUES)
    }
  }, [edit, isOpen, reset, selectedCertification])

  const onPendingFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPendingFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
    e.target.value = ''
  }

  const onSubmit: SubmitHandler<CertificationFormData> = async (data) => {
    if (edit && id) {
      await editCertification({ id, payload: data })
      setIsOpen(false)
      return
    }

    const created = await createCertification(data)
    if (pendingFiles.length > 0) {
      setIsUploadingPending(true)
      try {
        for (const file of pendingFiles) {
          await uploadCertificationFile(axiosPrivate, created.id, file)
        }
        await queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      } finally {
        setIsUploadingPending(false)
      }
    }
    setIsOpen(false)
  }

  const isSaving = createLoading || editLoading || isUploadingPending

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) setPendingFiles([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {edit ? <EditButton label="Edit certification" /> : <AddButton label="Add certification" />}
      </DialogTrigger>
      <DialogContent
        className="flex min-h-[550px] w-[400px] flex-col sm:w-[425px] sm:min-w-[650px]"
        style={{ boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)' }}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex w-full items-center justify-between">
              <span className="text-4xl font-bold text-[#143681]">
                {edit ? 'Edit certification' : 'Add certification'}
              </span>
              <button type="button" onClick={() => setIsOpen(false)}>
                <X className="size-9" />
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-1 flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(onSubmit)(e)
          }}
          noValidate
        >
          <div className="flex-1 space-y-6 overflow-auto">
            <div>
              <Label htmlFor="title" className="text-sm font-semibold text-[#1F2937]">
                Title <span>*</span>
              </Label>
              <CustomInput
                type="text"
                id="title"
                placeholder="Ex: TEFL Certificate"
                className="rounded-full border border-[#6B7280] bg-white"
                width="w-full"
                error={errors.title?.message}
                {...register('title')}
              />
            </div>
            <div>
              <Label htmlFor="issuer" className="text-sm font-semibold text-[#1F2937]">
                Issuing organization <span>*</span>
              </Label>
              <CustomInput
                type="text"
                id="issuer"
                placeholder="Ex: Cambridge"
                className="rounded-full border border-[#6B7280] bg-white"
                width="w-full"
                error={errors.issuer?.message}
                {...register('issuer')}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="issuedAt" className="text-sm font-semibold text-[#1F2937]">
                  Issue date (Optional)
                </Label>
                <Controller
                  name="issuedAt"
                  control={control}
                  render={({ field }) => (
                    <DatePickerField
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Select issue date"
                      error={errors.issuedAt?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="expiresAt" className="text-sm font-semibold text-[#1F2937]">
                  Expiration date (Optional)
                </Label>
                <Controller
                  name="expiresAt"
                  control={control}
                  render={({ field }) => (
                    <DatePickerField
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Select expiration date"
                      error={errors.expiresAt?.message}
                    />
                  )}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="credentialUrl" className="text-sm font-semibold text-[#1F2937]">
                Credential URL (Optional)
              </Label>
              <CustomInput
                type="url"
                id="credentialUrl"
                placeholder="https://example.com/verify/your-credential"
                className="rounded-full border border-[#6B7280] bg-white"
                width="w-full"
                error={errors.credentialUrl?.message}
                {...register('credentialUrl')}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#1F2937]">
                Supporting files (Optional)
              </Label>

              <div className="flex flex-col gap-2">
                {edit &&
                  selectedCertification?.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#E0E2E6] bg-[#F9FAFB] px-4 py-2.5"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(`/tutor/certifications/${id}/files/${file.id}/url`)
                        }
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <FileText className="size-4 shrink-0 text-[#6B7280]" aria-hidden="true" />
                        <span className="truncate text-sm font-medium text-[#1E293B]">
                          {file.fileName ?? 'Certification file'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteExistingFile(file.id)}
                        aria-label="Remove file"
                        className="shrink-0 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}

                {!edit &&
                  pendingFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#E0E2E6] bg-[#F9FAFB] px-4 py-2.5"
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        <FileText className="size-4 shrink-0 text-[#6B7280]" aria-hidden="true" />
                        <span className="truncate text-sm font-medium text-[#1E293B]">
                          {file.name}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPendingFiles((prev) => prev.filter((_, i) => i !== index))
                        }
                        aria-label="Remove file"
                        className="shrink-0 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingToExisting}
                className="h-10 rounded-full border-[#2563EB] bg-white px-4 text-sm font-medium text-[#2563EB] hover:bg-blue-50 hover:text-[#2563EB]/90"
              >
                {isUploadingToExisting ? 'Uploading…' : 'Attach a file'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  onChange={
                    edit
                      ? (e) => {
                          const file = e.target.files?.[0]
                          if (file) uploadToExisting(file)
                          e.target.value = ''
                        }
                      : onPendingFilesSelected
                  }
                  disabled={isUploadingToExisting}
                />
              </Button>
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
              className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
              disabled={isSaving}
            >
              {isUploadingPending ? 'Uploading files…' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CertificationForm
