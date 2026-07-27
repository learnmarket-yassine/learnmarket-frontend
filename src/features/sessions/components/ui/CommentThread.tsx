import { useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useStore } from '@/store/store'
import CommentBox, { Comment } from './CommentBox'

interface CommentThreadProps {
  comments: Comment[]
  onSubmit: (content: string) => Promise<unknown>
  onUpdate: (commentId: string, content: string) => Promise<unknown>
  onDelete: (commentId: string) => void
  isPending?: boolean
  isDeleting?: boolean
}

const CommentThread = ({
  comments,
  onSubmit,
  onUpdate,
  onDelete,
  isPending,
  isDeleting,
}: CommentThreadProps) => {
  const currentUserId = useStore((state) => state.auth.user?.id)
  const [reply, setReply] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    await onSubmit(reply.trim())
    setReply('')
  }

  return (
    <div className="flex flex-col gap-5">
      {comments.length > 0 &&
        comments.map((comment) => {
          const isOwnComment = comment.author.id === currentUserId
          const isEditing = editingId === comment.id
          return (
            <CommentBox
              comment={comment}
              isOwnComment={isOwnComment}
              isEditing={isEditing}
              setEditingId={setEditingId}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          )
        })}
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
          className="flex size-6 shrink-0 items-center justify-center text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendHorizontal className="size-6" />
        </button>
      </form>
    </div>
  )
}

export default CommentThread
