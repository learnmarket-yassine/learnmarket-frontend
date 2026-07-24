import { useState, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type MessageComposerProps = {
  isActive: boolean
  counterpartName: string
  onSend: (content: string) => void
}

const MessageComposer = ({ isActive, counterpartName, onSend }: MessageComposerProps) => {
  const [content, setContent] = useState('')

  const handleSend = () => {
    const trimmed = content.trim()
    if (!trimmed) return
    onSend(trimmed)
    setContent('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  if (!isActive) {
    return (
      <div className="rounded-2xl border border-[#E0E2E6] bg-[#F9FAFB] px-4 py-3 text-sm text-[#6B7280]">
        This conversation is no longer active. There's no pending or accepted proposal between you
        and {counterpartName} right now.
      </div>
    )
  }

  return (
    <div className="flex w-full items-center gap-2">
      <Textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value)
        }}
        onKeyDown={handleKeyDown}
        placeholder="Write a message…"
        className="min-h-[44px] w-full flex-1 resize-none rounded-2xl"
        rows={1}
      />
      <Button onClick={handleSend} disabled={!content.trim()} className="rounded-2xl">
        Send
      </Button>
    </div>
  )
}

export default MessageComposer
