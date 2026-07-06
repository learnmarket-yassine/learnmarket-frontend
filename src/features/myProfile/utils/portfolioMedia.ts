import type { ContentItem } from '@/components/ui/MediaBlock'
import { getAssetUrl } from '@/lib/utils'
import { PortfolioMedia } from '../store/types'

export function mediaToContentItem(media: PortfolioMedia): ContentItem {
  if (media.type === 'LINK') {
    return { id: media.id, mediaId: media.id, type: 'link', value: media.url ?? '' }
  }
  const resolvedUrl = getAssetUrl(media.key ?? media.url) ?? ''
  if (media.type === 'IMAGE') {
    return { id: media.id, mediaId: media.id, type: 'image', url: resolvedUrl }
  }
  return { id: media.id, mediaId: media.id, type: 'video', url: resolvedUrl }
}
