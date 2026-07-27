import { useRef, useState, type ChangeEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CustomInput } from '@/components/ui/CustomInput'
import UploadIcon from '@/assets/UploadIcon'

export type PortfolioVideoSubmit = { url: string; file?: File }

interface PortfolioVideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (video: PortfolioVideoSubmit) => void
}

function PortfolioVideoModal({ open, onOpenChange, onSubmit }: PortfolioVideoModalProps) {
  const [link, setLink] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetState = () => {
    setLink('')
    setFile(null)
    setError('')
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetState()
    onOpenChange(nextOpen)
  }

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value)
    setFile(null)
    setError('')
  }

  const handleFilePicked = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    if (!picked) return
    setFile(picked)
    setLink('')
    setError('')
    e.target.value = ''
  }

  const handleAdd = () => {
    if (file) {
      onSubmit({ url: URL.createObjectURL(file), file })
    } else if (link.trim()) {
      onSubmit({ url: link.trim() })
    } else {
      setError('Paste a YouTube link or upload a video')
      return
    }
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="flex w-[400px] flex-col space-y-4 sm:w-[425px] sm:min-w-[650px]"
        style={{
          boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex w-full items-center justify-between">
              <span className="text-4xl font-bold text-[#143681]">Add video link</span>
              <button
                type="button"
                onClick={() => {
                  handleOpenChange(false)
                }}
              >
                <X className="size-9" />
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 space-y-4 divide-y-[1px] divide-[#C3C6D7] overflow-y-auto">
          <div className="py-6">
            <Label htmlFor="video-link" className="text-base font-bold text-[#5E5E5E]">
              Paste a link to your YouTube video
            </Label>
            <CustomInput
              type="text"
              id="video-link"
              placeholder="Ex: https://youtu.be/dQw4w9WgXcQ?si=RAPuMbMiMSDsk1yp"
              className="rounded-full border bg-white"
              width="w-full"
              value={link}
              onChange={handleLinkChange}
            />
          </div>
          <div>
            <div className="space-y-4 py-6">
              <div className="space-y-2">
                <h2 className="text-base font-medium text-[#191B23]">Upload your video</h2>
                <h4 className="text-sm text-[#434655]">Up to 100 MB. Maximum 2 videos.</h4>
              </div>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-full items-center gap-2 border border-[#2563EB] px-6 py-3 font-bold text-[#2563EB]"
              >
                <UploadIcon />
                <span>{file ? file.name : 'Upload video'}</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFilePicked}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <p className="text-base font-semibold text-[#2563EB]">
              Does your video meet Yora's guidelines?
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
            onClick={handleAdd}
          >
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PortfolioVideoModal
