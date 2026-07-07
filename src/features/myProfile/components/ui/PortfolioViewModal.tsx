import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Eye, X } from 'lucide-react'
import { PortfolioItem } from '../../store/types'
import { Badge } from '@/components/ui/badge'
import MediaItemPreview from '@/components/ui/MediaItemPreview'
import { mediaToContentItem } from '../../utils/portfolioMedia'
import { Button } from '@/components/ui/button'

interface PortfolioViewModalProps {
  item: PortfolioItem
}

function PortfolioViewModal({ item }: PortfolioViewModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const mediaItems = (item.media ?? []).map(mediaToContentItem)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 rounded-full border border-[#2563EB] text-[#2563EB] hover:text-[#2563EB]`}
        >
          <Eye className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[90vh] w-[400px] flex-col space-y-8 sm:w-[425px] sm:min-w-[1200px]"
        style={{
          boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex w-full items-center justify-between">
              <span className="text-4xl font-bold text-[#143681]">{item.title}</span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                <X className="size-9" />
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col items-center space-y-6 overflow-y-auto">
          <div className="grid w-full grid-cols-5 items-start gap-16">
            <div className="col-span-2 space-y-8">
              {item.role && (
                <p className="flex items-center gap-2 font-medium text-[#42444a]">
                  My role : <span className="text-base font-semibold text-black">{item.role}</span>
                </p>
              )}
              <div className="space-y-3">
                <p className="font-medium text-[#42444a]">Project description</p>
                <p className="whitespace-pre-wrap break-words text-base text-black">
                  {item.description}
                </p>
              </div>
              <div className="space-y-4">
                <p className="font-medium text-[#42444a]">Skills and deliverables</p>
                {item.skills && item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {item.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="h-9 rounded-lg border-none bg-[#1a46a7] px-4 py-2 text-base text-white"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-3 space-y-3">
              {mediaItems.map((mediaItem) => (
                <div
                  key={mediaItem.id}
                  className="group relative w-full overflow-hidden rounded-3xl border-2 border-dashed border-[#2563EB] p-2"
                >
                  <MediaItemPreview item={mediaItem} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PortfolioViewModal
