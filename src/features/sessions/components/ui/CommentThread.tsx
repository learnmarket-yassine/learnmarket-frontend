import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { getAssetUrl } from '@/lib/utils'
import { CommentAuthor } from '@/features/scheduling/types/dto'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: CommentAuthor
}

interface CommentThreadProps {
  comments: Comment[]
  onSubmit: (content: string) => Promise<unknown>
  isPending?: boolean
}

const CommentThread = ({ comments, onSubmit, isPending }: CommentThreadProps) => {
  const [reply, setReply] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    await onSubmit(reply.trim())
    setReply('')
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.length > 0 && (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <Avatar size="sm">
                <AvatarImage src={getAssetUrl(comment.author.avatar)} />
                <AvatarFallback>
                  {comment.author.firstname[0]}
                  {comment.author.lastname[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 rounded-2xl bg-[#F3F4F6] px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#1E293B]">
                    {comment.author.firstname} {comment.author.lastname}
                  </span>
                  <span className="shrink-0 text-[10px] text-[#6B7280]">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words text-sm text-[#374151]">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a comment…"
          disabled={isPending}
          className="rounded-full"
        />
        <button
          type="submit"
          disabled={!reply.trim() || isPending}
          aria-label="Send comment"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="size-3.5" />
        </button>
      </form>
    </div>
  )
}

export default CommentThread
