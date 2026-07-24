import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getAssetUrl } from '@/lib/utils'
import { Conversation } from '../../store/types'
import { getCounterpart } from '../../utils/getCounterpart'

type ConversationListItemProps = {
  conversation: Conversation
  currentUserId: string | undefined
  isSelected: boolean
  onSelect: () => void
}

const ConversationListItem = ({
  conversation,
  currentUserId,
  isSelected,
  onSelect,
}: ConversationListItemProps) => {
  const counterpart = getCounterpart(conversation, currentUserId)
  const lastMessage = conversation.messages[0]

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-[#F3F4F6]',
        isSelected && 'bg-[#EFF6FF]'
      )}
    >
      <Avatar size="lg">
        <AvatarImage src={getAssetUrl(counterpart.avatar)} />
        <AvatarFallback>
          {counterpart.firstname[0]}
          {counterpart.lastname[0]}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-[#143681]">
            {counterpart.firstname} {counterpart.lastname}
          </p>
          {lastMessage && (
            <span className="shrink-0 text-xs text-[#6B7280]">
              {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm text-[#6B7280]">
            {lastMessage?.content ?? 'No messages yet'}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB] px-1.5 text-[10px] font-semibold text-white">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export default ConversationListItem
