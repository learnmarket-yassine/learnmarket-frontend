import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PlusIcon from '@/assets/PlusIcon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStore } from '@/store/store'
import { cn } from '@/lib/utils'
import useUploadAvatar from '../../hooks/useUploadAvatar'

const MIN_DIMENSION = 250
const MAX_FILE_SIZE_MB = 5
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const PREVIEW_SIZES = [64, 48, 32, 24] as const

function UploadImageForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const user = useStore((state) => state.auth.user)
  const { mutateAsync: uploadAvatar, isPending: isUploading } = useUploadAvatar()

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const validateAndSetFile = (candidate: File) => {
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.')
      return
    }
    if (candidate.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    const objectUrl = URL.createObjectURL(candidate)
    const img = new Image()
    img.onload = () => {
      if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
        setError(`Image must be at least ${MIN_DIMENSION}x${MIN_DIMENSION}px.`)
        URL.revokeObjectURL(objectUrl)
        return
      }
      setError(null)
      setFile(candidate)
      setPreviewUrl(objectUrl)
    }
    img.onerror = () => {
      setError('This file could not be read as an image.')
      URL.revokeObjectURL(objectUrl)
    }
    img.src = objectUrl
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) validateAndSetFile(selected)
    e.target.value = '' // allow re-selecting the same file after an error
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) validateAndSetFile(dropped)
  }

  const resetState = () => {
    setFile(null)
    setPreviewUrl(null)
    setError(null)
  }

  const handleClose = () => {
    resetState()
    setIsOpen(false)
  }

  const handleAttach = async () => {
    if (!file) return
    try {
      await uploadAvatar(file)
      handleClose()
    } catch {
      setError('Failed to upload the image. Please try again.')
    }
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) resetState()
          setIsOpen(open)
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant={'outline'}
            className="flex h-full items-center gap-2 rounded-full border border-[#2563EB] px-6 py-2 text-sm font-semibold text-[#2563EB] hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            <PlusIcon className="size-4" />
            <span>Upload photo</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="flex min-w-[750px] flex-col space-y-9"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader className="space-y-5">
            <DialogTitle className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                <X className="size-9" />
              </button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-1 items-start gap-8">
            <div className="flex w-full flex-col items-center justify-center space-y-12">
              <h1 className="text-4xl font-bold text-[#1F2937]">Your photo</h1>
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload or drop an image"
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
                }}
                className={cn(
                  'flex h-[250px] w-[250px] cursor-pointer flex-col items-center justify-center gap-3 rounded-full border-2 border-dashed text-center transition-colors',
                  isDragging ? 'border-[#2563EB]' : 'border-[#D1D5DB]'
                )}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Selected profile preview"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <>
                    <User className="size-12 text-[#374151]" strokeWidth={1.5} />
                    <p className="text-sm font-semibold text-[#4B5563]">
                      <span className="font-normal text-[#2563EB] underline">Upload</span> or drop
                      image here
                    </p>
                  </>
                )}
              </div>
              <div>
                {error ? (
                  <p role="alert" className="text-xs text-red-600">
                    {error}
                  </p>
                ) : (
                  <p className="text-xs text-[#9CA3AF]">
                    {MIN_DIMENSION}x{MIN_DIMENSION} Min / {MAX_FILE_SIZE_MB}MB Max
                  </p>
                )}
              </div>

              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
            <div className="flex w-full flex-col items-center justify-center space-y-20">
              <h1 className="text-4xl font-bold text-[#1F2937]">
                Show clients the best version of yourself!
              </h1>
              <div className="flex w-full items-end gap-2">
                {PREVIEW_SIZES.map((size) => (
                  <Avatar
                    key={size}
                    className="after:border-none"
                    style={{ width: size, height: size }}
                  >
                    <AvatarImage src={previewUrl ? previewUrl : ''} alt={user?.firstname} />
                    <AvatarFallback className="bg-[#F3F4F6] text-sm font-semibold text-white" />
                  </Avatar>
                ))}
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1F2937]">
                  Must be an actual photo of you.
                </h3>
                <p className="text-base text-[#6B7280]">
                  Logos, clip-art, group photos, and digitally- altered images are not allowed.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              data-mdb-button-init
              data-mdb-ripple-init
              className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              data-mdb-button-init
              data-mdb-ripple-init
              className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
              onClick={handleAttach}
              disabled={!file || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Attach photo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UploadImageForm
