import ImageIcon from '@/assets/ImageIcon'
import VideoIcon from '@/assets/VideoIcon'
import LinkIcon from '@/assets/LinkIcon'
import PortfolioVideoModal from '@/features/myProfile/components/ui/PortfolioVideoModal'
import PortfolioWebLinkModal from '@/features/myProfile/components/ui/PortfolioWebLinkModal'
import { useRef, useState, type ChangeEvent } from 'react'
import { Label } from './label'
import MediaItemCard from './MediaItemCard'

type MediaKey = 'image' | 'video' | 'text' | 'link'

export type ContentItem = { id: string; mediaId?: string } & (
  | { type: 'image'; file?: File; url: string }
  | { type: 'video'; url: string; file?: File }
  | { type: 'link'; value: string }
)

interface MediaBlockProps {
  initialItems?: ContentItem[]
  onChange?: (items: ContentItem[]) => void
  onRemoveItem?: (item: ContentItem) => void
}

interface IconConfig {
  key: MediaKey
  label: string
  Icon: React.ReactNode
}

const ICONS: IconConfig[] = [
  { key: 'image', label: 'Add image', Icon: <ImageIcon /> },
  { key: 'video', label: 'Add video', Icon: <VideoIcon /> },
  { key: 'link', label: 'Add link', Icon: <LinkIcon /> },
]

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

function MediaBlock({ initialItems, onChange, onRemoveItem }: MediaBlockProps) {
  const [items, setItems] = useState<ContentItem[]>(initialItems ?? [])
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)

  const imageInputRef = useRef<HTMLInputElement>(null)

  const addItem = (item: ContentItem) => {
    setItems((prev) => {
      const next = [...prev, item]
      onChange?.(next)
      return next
    })
  }

  const removeItem = (item: ContentItem) => {
    onRemoveItem?.(item)
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== item.id)
      onChange?.(next)
      return next
    })
  }

  const handleImagePicked = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    addItem({ id: createId(), type: 'image', file, url: URL.createObjectURL(file) })
    e.target.value = ''
  }

  const handleIconClick = (key: MediaKey) => {
    switch (key) {
      case 'image':
        imageInputRef.current?.click()
        break
      case 'video':
        setIsVideoModalOpen(true)
        break
      case 'link':
        setIsLinkModalOpen(true)
        break
    }
  }

  return (
    <div className="w-full">
      <Label htmlFor="media" className="invisible text-base font-bold text-[#5E5E5E]">
        Media
      </Label>
      <div className="space-y-4">
        {items.length > 0 && (
          <div className="w-full space-y-3">
            {items.map((item) => (
              <MediaItemCard key={item.id} item={item} onRemove={() => removeItem(item)} />
            ))}
          </div>
        )}

        <div className="flex h-[200px] items-center justify-center rounded-2xl border-[0.5px] border-dashed text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              {ICONS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  aria-label={label}
                  onClick={() => handleIconClick(key)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-dashed border-[#8E949F]"
                >
                  {Icon}
                </button>
              ))}
            </div>
            <p className="text-base">add content</p>
          </div>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImagePicked}
        />

        <PortfolioVideoModal
          open={isVideoModalOpen}
          onOpenChange={setIsVideoModalOpen}
          onSubmit={(video) => addItem({ id: createId(), type: 'video', ...video })}
        />
        <PortfolioWebLinkModal
          open={isLinkModalOpen}
          onOpenChange={setIsLinkModalOpen}
          onSubmit={(value) => addItem({ id: createId(), type: 'link', value })}
        />
      </div>
    </div>
  )
}
export default MediaBlock
