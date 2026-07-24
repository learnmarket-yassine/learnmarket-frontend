import { cn } from '@/lib/utils'
import { Message } from '../../store/types'

type MessageBubbleProps = {
  message: Message
  isOwn: boolean
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm',
          isOwn ? 'bg-[#2563EB] text-white' : 'bg-[#F3F4F6] text-[#1E293B]',
          message.pending && 'opacity-60'
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

export default MessageBubble
