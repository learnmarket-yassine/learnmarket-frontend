import { useState, type ChangeEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CustomInput } from '@/components/ui/CustomInput'

interface PortfolioWebLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (url: string) => void
}

function PortfolioWebLinkModal({ open, onOpenChange, onSubmit }: PortfolioWebLinkModalProps) {
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  const resetState = () => {
    setLink('')
    setError('')
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetState()
    onOpenChange(nextOpen)
  }

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value)
    setError('')
  }

  const handleAdd = () => {
    if (!link.trim()) {
      setError('Add a web link')
      return
    }
    onSubmit(link.trim())
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
              <span className="text-4xl font-bold text-[#143681]">Add a web link</span>
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
        <div className="flex-1 space-y-4 overflow-y-auto">
          <div className="py-6">
            <Label htmlFor="web-link" className="text-base font-bold text-[#5E5E5E]">
              Paste a web link to an article or website
            </Label>
            <CustomInput
              type="text"
              id="web-link"
              placeholder="Article or website link"
              className="rounded-full border bg-white"
              width="w-full"
              value={link}
              onChange={handleLinkChange}
              error={error}
            />
          </div>
          <p className="text-base font-semibold text-[#2563EB]">
            Does your video meet Yora's guidelines?
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
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

export default PortfolioWebLinkModal
