import ConfirmModal from '@/components/layout/ConfirmModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CommentAuthor } from '@/features/scheduling/types/dto'
import { getAssetUrl } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { Pencil, SendHorizontal, Trash, X } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'

export interface Comment {
  id: string
  content: string
  createdAt: string
  author: CommentAuthor
}

interface CommentBoxProps {
  comment: Comment
  isEditing: boolean
  isOwnComment: boolean
  setEditingId: Dispatch<SetStateAction<string | null>>
  onUpdate: (commentId: string, content: string) => Promise<unknown>
  onDelete: (commentId: string) => void
  isDeleting?: boolean
}

const CommentBox = ({
  isEditing,
  isOwnComment,
  comment,
  setEditingId,
  onUpdate,
  onDelete,
  isDeleting,
}: CommentBoxProps) => {
  const [editValue, setEditValue] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id)
    setEditValue(comment.content)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditValue('')
  }

  const handleUpdate = async (commentId: string) => {
    if (!editValue.trim()) return
    await onUpdate(commentId, editValue.trim())
    setEditingId(null)
    setEditValue('')
  }
  return (
    <div className="space-y-2">
      <span className="flex items-center justify-end text-xs">
        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
      </span>
      <div className="flex items-start gap-4">
        <Avatar size="lg">
          <AvatarImage src={getAssetUrl(comment.author.avatar)} />
          <AvatarFallback>
            {comment.author.firstname[0]}
            {comment.author.lastname[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold">
              {comment.author.firstname} {comment.author.lastname}
            </span>
            {isOwnComment && !isEditing && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => startEditing(comment)}
                  variant="outline"
                  className="whitespace-nowrap rounded-full border-[#2563EB] bg-white font-medium text-[#2563EB] hover:bg-blue-50 hover:text-[#2563EB]/90"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsConfirmOpen(true)}
                  variant="outline"
                  className="whitespace-nowrap rounded-full border-red-800 bg-white font-medium text-red-800 hover:bg-red-800 hover:text-white"
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            )}
          </div>
          {isEditing ? (
            <div className="mt-2 flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="rounded-full"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleUpdate(comment.id)}
                disabled={!editValue.trim()}
                aria-label="Save comment"
                className="shrink-0 text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SendHorizontal className="size-5" />
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                aria-label="Cancel edit"
                className="shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words text-sm">{comment.content}</p>
          )}
        </div>
      </div>
      <ConfirmModal
        name="Event Exception Modal"
        type="confirm"
        isOpen={isConfirmOpen}
        setIsOpen={(next) => setIsConfirmOpen(!!next)}
        title="Delete this comment?"
        description="Once deleted, this comment cannot be recovered."
        handleConfirm={() => {
          onDelete(comment.id)
          setIsConfirmOpen(false)
        }}
        isLoading={isDeleting}
        confirmButtonText="Delete comment"
      />
    </div>
  )
}

export default CommentBox
