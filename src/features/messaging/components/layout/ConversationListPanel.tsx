import { Conversation } from '../../store/types'
import ConversationListItem from '../ui/ConversationListItem'

type ConversationListPanelProps = {
  conversations: Conversation[]
  currentUserId: string | undefined
  selectedConversationId: string | undefined
  onSelect: (conversationId: string) => void
}

const ConversationListPanel = ({
  conversations,
  currentUserId,
  selectedConversationId,
  onSelect,
}: ConversationListPanelProps) => {
  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-r border-[#E0E2E6]">
      <div className="border-b border-[#E0E2E6] px-5 py-4">
        <h2 className="text-lg font-semibold text-[#143681]">Messages</h2>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {conversations.length === 0 && (
          <p className="p-3 text-sm text-[#6B7280]">No conversations yet.</p>
        )}
        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            currentUserId={currentUserId}
            isSelected={conversation.id === selectedConversationId}
            onSelect={() => onSelect(conversation.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default ConversationListPanel
