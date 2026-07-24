import { useState } from 'react'
import { X } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogPortal, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getAssetUrl } from '@/lib/utils'
import useCreateConversation from '../../hooks/useCreateConversation'
import useSendConversationMessage from '../../hooks/useSendConversationMessage'

export type MessageRecipient = {
  id: string
  firstname: string
  lastname: string
  avatar?: string | null
  headline?: string | null
}

type SendMessageModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipient: MessageRecipient
  onSent?: (conversationId: string) => void
}

type SendMessageFormProps = {
  recipient: MessageRecipient
  onClose: () => void
  onSent?: (conversationId: string) => void
}

const SendMessageForm = ({ recipient, onClose, onSent }: SendMessageFormProps) => {
  const [content, setContent] = useState('')
  const createConversation = useCreateConversation()
  const sendMessage = useSendConversationMessage()

  const isSending = createConversation.isPending || sendMessage.isPending
  const errorMessage =
    (createConversation.error as { response?: { data?: { message?: string } } } | undefined)
      ?.response?.data?.message ??
    (sendMessage.error as { response?: { data?: { message?: string } } } | undefined)?.response
      ?.data?.message

  const handleSend = async () => {
    const trimmed = content.trim()
    if (!trimmed) return
    const conversation = await createConversation.mutateAsync(recipient.id)
    await sendMessage.mutateAsync({ conversationId: conversation.id, content: trimmed })
    onSent?.(conversation.id)
    onClose()
  }

  const initials = `${recipient.firstname[0] ?? ''}${recipient.lastname[0] ?? ''}`.toUpperCase()

  return (
    <>
      <div className="flex items-center justify-between">
        <DialogTitle className="text-xl font-bold text-[#1E293B]">
          Message {recipient.firstname}
        </DialogTitle>
        <DialogPrimitive.Close
          className="rounded-full p-1 text-[#6B7280] hover:bg-[#F3F4F6] focus-visible:outline-none"
          aria-label="Close"
        >
          <X className="size-5" />
        </DialogPrimitive.Close>
      </div>

      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarImage src={getAssetUrl(recipient.avatar)} />
          <AvatarFallback className="bg-[#2563EB] text-sm font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-[#143681]">
            {recipient.firstname} {recipient.lastname}
          </p>
          {recipient.headline && <p className="text-sm text-[#6B7280]">{recipient.headline}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="send-message-content" className="text-sm font-medium text-[#1E293B]">
          Message
        </label>
        <Textarea
          id="send-message-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[160px] rounded-2xl"
        />
      </div>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <div className="flex justify-end border-t border-[#E0E2E6] pt-4">
        <Button
          type="button"
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          className={cn(
            'rounded-full bg-[#2563EB] px-8 py-5 font-medium text-white hover:bg-[#2563EB]/90'
          )}
        >
          {isSending ? 'Sending…' : 'Send Message'}
        </Button>
      </div>
    </>
  )
}

const SendMessageModal = ({ open, onOpenChange, recipient, onSent }: SendMessageModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          onClick={(e) => e.stopPropagation()}
          className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-3xl border border-[#E0E2E6] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {open && (
            <SendMessageForm
              recipient={recipient}
              onClose={() => onOpenChange(false)}
              onSent={onSent}
            />
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

export default SendMessageModal
