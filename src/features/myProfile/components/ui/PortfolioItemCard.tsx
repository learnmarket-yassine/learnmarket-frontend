import { PortfolioItem } from '../../store/types'
import FolderIcon from '@/assets/FolderIcon'
import PortfolioForm from './PortfolioForm'
import PortfolioViewModal from './PortfolioViewModal'
import { getAssetUrl } from '@/lib/utils'

interface PortfolioItemCardProps {
  item: PortfolioItem
}

function PortfolioItemCard({ item }: PortfolioItemCardProps) {
  const thumbnail = item.media?.find((media) => media.type === 'IMAGE')
  const thumbnailUrl = thumbnail && getAssetUrl(thumbnail.key ?? thumbnail.url)

  return (
    <div className="group space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#D1D5DA]">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#b0b5bf]">
            <FolderIcon className="size-12" />
          </div>
        )}
        <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <PortfolioViewModal item={item} />
          <PortfolioForm edit id={item.id} />
        </div>
      </div>
      <p className="truncate px-2 text-xl font-bold text-[#42444a] hover:cursor-pointer hover:underline">
        {item.title}
      </p>
    </div>
  )
}
export default PortfolioItemCard
