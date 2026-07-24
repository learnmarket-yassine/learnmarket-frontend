import { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAssetUrl } from '@/lib/utils'
import useGetMessages from '../../hooks/useGetMessages'
import useSendMessage from '../../hooks/useSendMessage'
import useConversationActiveState from '../../hooks/useConversationActiveState'
import useMarkConversationRead from '../../hooks/useMarkConversationRead'
import { Conversation } from '../../store/types'
import { getCounterpart } from '../../utils/getCounterpart'
import MessageBubble from './MessageBubble'
import MessageComposer from './MessageComposer'

type ConversationThreadProps = {
  conversation: Conversation
  currentUserId: string | undefined
}

const NEAR_BOTTOM_THRESHOLD_PX = 80

const ConversationThread = ({ conversation, currentUserId }: ConversationThreadProps) => {
  const counterpart = getCounterpart(conversation, currentUserId)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetMessages(conversation.id)
  const isActive = useConversationActiveState(conversation.id, conversation.isActive)
  const sendMessage = useSendMessage(conversation.id)
  const markRead = useMarkConversationRead()

  const scrollRef = useRef<HTMLDivElement>(null)
  const isNearBottomRef = useRef(true)

  const messages = data?.pages.flatMap((page) => page.paginatedResult).reverse() ?? []
  const newestMessageId = messages[messages.length - 1]?.id

  useEffect(() => {
    if (!newestMessageId) return
    markRead(conversation.id)
  }, [conversation.id, newestMessageId, markRead])

  useEffect(() => {
    const container = scrollRef.current
    if (!container || !isNearBottomRef.current) return
    container.scrollTop = container.scrollHeight
  }, [newestMessageId])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    container.scrollTop = container.scrollHeight
    isNearBottomRef.current = true
  }, [conversation.id])

  const handleScroll = () => {
    const container = scrollRef.current
    if (!container) return

    isNearBottomRef.current =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      NEAR_BOTTOM_THRESHOLD_PX

    if (container.scrollTop < 80 && hasNextPage && !isFetchingNextPage) {
      const previousHeight = container.scrollHeight
      fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          if (!scrollRef.current) return
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight - previousHeight
        })
      })
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-3 border-b border-[#E0E2E6] px-5 py-4">
        <Avatar>
          <AvatarImage src={getAssetUrl(counterpart.avatar)} />
          <AvatarFallback>
            {counterpart.firstname[0]}
            {counterpart.lastname[0]}
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold text-[#143681]">
          {counterpart.firstname} {counterpart.lastname}
        </p>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 space-y-2 overflow-y-auto px-5 py-4"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUserId}
          />
        ))}
      </div>
      <div className="w-full border-t border-[#E0E2E6] p-4">
        <MessageComposer
          isActive={isActive}
          counterpartName={`${counterpart.firstname} ${counterpart.lastname}`}
          onSend={sendMessage}
        />
      </div>
    </div>
  )
}

export default ConversationThread
