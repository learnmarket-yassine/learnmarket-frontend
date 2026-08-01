import { useCallback, useRef, useState } from 'react'
import { Loader2, UploadCloud, CheckCircle2, RotateCcw, X } from 'lucide-react'
import { cn, formatAcceptLabel, formatFileSize } from '@/lib/utils'
import PdfFileIcon from '@/assets/PdfFileIcon'

type UploadState<TMeta> =
  | { status: 'idle' }
  | { status: 'uploading'; file: File }
  | { status: 'done'; file: File; result: TMeta }
  | { status: 'error'; file: File; error: string }

export interface FileUploadProps<TMeta = unknown> {
  accept?: string[] // e.g. ['image/jpeg', 'image/png', 'application/pdf']
  maxSizeMB: number
  disabled?: boolean
  uploadFn: (file: File) => Promise<TMeta>
  onUploaded?: (result: TMeta) => void
  resetAfterUpload?: boolean
}

function FileUpload<TMeta = unknown>({
  accept,
  maxSizeMB,
  disabled = false,
  uploadFn,
  onUploaded,
  resetAfterUpload = false,
}: FileUploadProps<TMeta>) {
  const [state, setState] = useState<UploadState<TMeta>>({ status: 'idle' })
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(
    async (file: File) => {
      setState({ status: 'uploading', file })
      try {
        const result = await uploadFn(file)
        setState({ status: 'done', file, result })
        onUploaded?.(result)
        if (resetAfterUpload) {
          setState((prev) =>
            prev.status === 'done' && prev.file === file ? { status: 'idle' } : prev
          )
        }
      } catch {
        setState({ status: 'error', file, error: 'Upload failed. Please try again.' })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadFn, onUploaded]
  )

  const [rejection, setRejection] = useState<string | null>(null)

  const handleFile = useCallback(
    (fileList: FileList | null) => {
      const file = fileList?.[0]
      if (!file) return
      setRejection(null)

      if (accept && accept.length > 0 && !accept.includes(file.type)) {
        setRejection(`"${file.name}" isn't an accepted file type.`)
        return
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setRejection(`"${file.name}" exceeds the ${maxSizeMB}MB limit.`)
        return
      }
      upload(file)
    },
    [accept, maxSizeMB, upload]
  )

  const handleCancel = () => {
    setState({ status: 'idle' })
    setRejection(null)
  }

  if (state.status === 'idle' || state.status === 'uploading') {
    const isUploading = state.status === 'uploading'
    return (
      <div className="space-y-1.5">
        <div
          role="button"
          tabIndex={disabled || isUploading ? -1 : 0}
          aria-disabled={disabled || isUploading}
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (!disabled && !isUploading && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            if (!disabled && !isUploading) setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            if (!disabled && !isUploading) handleFile(e.dataTransfer.files)
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-3 text-center transition-colors',
            isDragging
              ? 'border-[#2563EB] bg-[#EEF3FF]'
              : 'border-[#D9D9D9] bg-white hover:border-[#2563EB]/50',
            (disabled || isUploading) && 'cursor-not-allowed opacity-50'
          )}
        >
          {isUploading ? (
            <Loader2 className="size-7 animate-spin text-[#2563EB]" aria-hidden="true" />
          ) : (
            <UploadCloud className="size-7" aria-hidden="true" />
          )}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">
              {isUploading ? (
                <span className="text-[#2563EB]">Uploading {state.file.name}…</span>
              ) : (
                <>
                  <span className="text-[#2563EB]">Upload</span> or drag your file here
                </>
              )}
            </p>
            {!isUploading && (
              <p className="text-xs text-[#9CA3AF]">
                {formatAcceptLabel(accept)} formats, up to {maxSizeMB}MB
              </p>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept?.join(',')}
            disabled={disabled || isUploading}
            onChange={(e) => {
              handleFile(e.target.files)
              e.target.value = ''
            }}
            className="sr-only"
            aria-label="Upload a file"
          />
        </div>
        {rejection && <p className="text-xs text-red-600">{rejection}</p>}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E0E2E6] bg-white px-3 py-2.5">
      <PdfFileIcon />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#1E293B]">{state.file.name}</p>
        <p className="text-xs text-[#6B7280]">{formatFileSize(state.file.size)}</p>
        {state.status === 'error' && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
      </div>

      {state.status === 'done' && <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />}
      {state.status === 'error' && (
        <button
          type="button"
          onClick={() => upload(state.file)}
          aria-label={`Retry uploading ${state.file.name}`}
          className="shrink-0 text-[#6B7280] hover:text-[#2563EB]"
        >
          <RotateCcw className="size-4" />
        </button>
      )}
      {state.status === 'error' && (
        <button
          type="button"
          onClick={handleCancel}
          aria-label={`Cancel uploading ${state.file.name}`}
          className="shrink-0 text-[#6B7280] hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

export default FileUpload
