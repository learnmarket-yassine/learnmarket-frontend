import { TrashIcon } from 'lucide-react'
import { ContentItem } from './MediaBlock'
import MediaItemPreview from './MediaItemPreview'

function MediaItemCard({ item, onRemove }: { item: ContentItem; onRemove: () => void }) {
  return (
    <div className="group relative w-full overflow-hidden rounded-3xl border-2 border-dashed border-[#2563EB]">
      <MediaItemPreview item={item} />
      <button
        type="button"
        aria-label="Remove content"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#2563EB] shadow-sm hover:bg-white"
      >
        <TrashIcon className="size-5" />
      </button>
    </div>
  )
}
export default MediaItemCard
