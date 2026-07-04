import { Dialog, DialogContent } from '@/components/ui/dialog'
import ReactPlayer from 'react-player/youtube'
import { X } from 'lucide-react'

type Props = {
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  videoUrl: string | null
}

const VideoModal = (props: Props) => {
  const url = props.videoUrl || ''

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent className="flex max-w-[350px] flex-wrap py-8 sm:max-w-[800px]">
        <button
          onClick={() => props.setIsOpen?.(false)}
          className="absolute right-4 top-4 rounded-full p-2"
        >
          <X className="size-4" />
        </button>

        <div className="w-full rounded-lg p-4">
          <div className="relative aspect-video overflow-hidden rounded-[16px]">
            <ReactPlayer url={url} controls={true} height="100%" width="100%" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VideoModal
