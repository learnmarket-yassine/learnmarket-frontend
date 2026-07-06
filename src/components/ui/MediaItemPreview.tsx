import { ContentItem } from './MediaBlock'
import MediaLinkItem from './MediaLinkItem'
import ReactPlayer from 'react-player/youtube'

function MediaItemPreview({ item }: { item: ContentItem }) {
  switch (item.type) {
    case 'image':
      return <img src={item.url} alt="Portfolio upload" className="h-full w-full object-cover" />
    case 'video': {
      return (
        <div className="relative aspect-video overflow-hidden rounded-[16px]">
          {item.file ? (
            <video src={item.url} controls className="h-full w-full object-cover" />
          ) : (
            <ReactPlayer url={item.url} controls={true} height="100%" width="100%" />
          )}
        </div>
      )
    }
    case 'link':
      return <MediaLinkItem link={item.value} />
  }
}
export default MediaItemPreview
