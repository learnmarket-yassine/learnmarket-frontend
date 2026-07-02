import ImageIcon from '@/assets/ImageIcon'
import LinkIcon from '@/assets/LinkIcon'
import TextIcon from '@/assets/TextIcon'
import VideoIcon from '@/assets/VideoIcon'
import { useRef, useState, type ChangeEvent } from 'react'

type FileContentType = 'image' | 'video'
type InlineContentType = 'text' | 'link'

export type ContentItem =
  { type: FileContentType; file: File; url: string } | { type: InlineContentType; value: string }

interface MediaBlockProps {
  onAdd?: (item: ContentItem) => void
}

interface IconConfig {
  key: FileContentType | InlineContentType
  label: string
  Icon: React.ReactNode
}

const ICONS: IconConfig[] = [
  { key: 'image', label: 'Add image', Icon: <ImageIcon /> },
  { key: 'video', label: 'Add video', Icon: <VideoIcon /> },
  { key: 'text', label: 'Add text', Icon: <TextIcon /> },
  { key: 'link', label: 'Add link', Icon: <LinkIcon /> },
]

function MediaBlock({ onAdd }: MediaBlockProps) {
  const [activeInput, setActiveInput] = useState<InlineContentType | null>(null)
  const [inputValue, setInputValue] = useState('')

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const emit = (item: ContentItem) => {
    onAdd?.(item)
  }

  const handleFilePicked = (type: FileContentType) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    emit({ type, file, url: URL.createObjectURL(file) })
    e.target.value = ''
  }

  const submitInline = () => {
    const value = inputValue.trim()
    if (!value || !activeInput) {
      setActiveInput(null)
      return
    }
    emit({ type: activeInput, value })
    setInputValue('')
    setActiveInput(null)
  }

  const handleIconClick = (key: IconConfig['key']) => {
    switch (key) {
      case 'image':
        imageInputRef.current?.click()
        break
      case 'video':
        videoInputRef.current?.click()
        break
      case 'text':
      case 'link':
        setActiveInput(key)
        break
    }
  }

  return (
    <div className={`rounded-2xl border-[0.5px] border-dashed px-64 py-24 text-center`}>
      {activeInput ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          {activeInput === 'text' ? (
            <textarea
              autoFocus
              rows={3}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write something..."
              className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-green-500"
            />
          ) : (
            <input
              autoFocus
              type="url"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitInline()}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-green-500"
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={submitInline}
              className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-500"
            >
              Add
            </button>
            <button
              onClick={() => {
                setActiveInput(null)
                setInputValue('')
              }}
              className="rounded-lg px-4 py-1.5 text-sm font-medium text-neutral-400 hover:text-neutral-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
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
      )}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFilePicked('image')}
      />
    </div>
  )
}
export default MediaBlock
