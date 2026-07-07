import { getDomain } from '@/lib/utils'
import { LinkIcon } from 'lucide-react'

type MediaLinkItemProps = {
  link: string
}

function MediaLinkItem({ link }: MediaLinkItemProps) {
  return (
    <div className="h-full w-full p-16">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full w-full items-center justify-between"
      >
        <span className="line-clamp-3 break-all text-base font-bold">{getDomain(link)}</span>
        <LinkIcon className="size-6" />
      </a>
    </div>
  )
}
export default MediaLinkItem
