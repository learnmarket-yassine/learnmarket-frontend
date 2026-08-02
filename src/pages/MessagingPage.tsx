import ConversationListPanel from '@/features/messaging/components/layout/ConversationListPanel'
import MessagingLayout from '@/features/messaging/components/layout/MessagingLayout'
import ConversationThread from '@/features/messaging/components/ui/ConversationThread'
import useGetConversations from '@/features/messaging/hooks/useGetConversations'
import { useStore } from '@/store/store'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const MessagingPage = () => {
  const currentUserId = useStore((state) => state.auth.user?.id)
  const { data: conversations = [], isPending } = useGetConversations()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedConversationId = searchParams.get('conversationId') ?? undefined

  useEffect(() => {
    if (selectedConversationId || conversations.length === 0) return
    setSearchParams({ conversationId: conversations[0].id }, { replace: true })
  }, [selectedConversationId, conversations, setSearchParams])

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)
  return (
    <MessagingLayout>
      <div className="flex h-[calc(100vh-14rem)] min-h-[500px] overflow-hidden rounded-3xl border border-[#E0E2E6] bg-white">
        <ConversationListPanel
          conversations={conversations}
          currentUserId={currentUserId}
          selectedConversationId={selectedConversationId}
          onSelect={(conversationId) => setSearchParams({ conversationId })}
        />
        <div className="flex flex-1 flex-col">
          {selectedConversation ? (
            <ConversationThread
              key={selectedConversation.id}
              conversation={selectedConversation}
              currentUserId={currentUserId}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-[#6B7280]">
              {isPending ? 'Loading conversations…' : 'Select a conversation to start messaging.'}
            </div>
          )}
        </div>
      </div>
    </MessagingLayout>
  )
}

export default MessagingPage
