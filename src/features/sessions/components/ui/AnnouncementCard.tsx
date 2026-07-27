import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RichTextContent } from '@/components/ui/rich-text-content'
import { getAssetUrl } from '@/lib/utils'
import { useStore } from '@/store/store'
import { Announcement } from '@/features/scheduling/types/dto'
import useCreateAnnouncementComment from '../../hooks/useCreateAnnouncementComment'
import useUpdateAnnouncementComment from '../../hooks/useUpdateAnnouncementComment'
import useDeleteAnnouncementComment from '../../hooks/useDeleteAnnouncementComment'
import useDownloadClassroomAttachment from '../../hooks/useDownloadClassroomAttachment'
import useDeleteAnnouncement from '../../hooks/useDeleteAnnouncement'
import { formatFileSize } from '../../utils/formatFileSize'
import CommentThread from './CommentThread'
import AnnouncementModal from './AnnouncementModal'
import ConfirmModal from '@/components/layout/ConfirmModal'

interface AnnouncementCardProps {
  sessionId: string
  announcement: Announcement
}

const AnnouncementCard = ({ sessionId, announcement }: AnnouncementCardProps) => {
  const currentUserId = useStore((state) => state.auth.user?.id)
  const isAuthor = announcement.authorId === currentUserId

  const { handleCreateComment } = useCreateAnnouncementComment(sessionId)
  const { handleUpdateComment } = useUpdateAnnouncementComment(sessionId)
  const { handleDeleteComment, isPending: isDeletingComment } =
    useDeleteAnnouncementComment(sessionId)
  const { handleDownload } = useDownloadClassroomAttachment()
  const { handleDelete, isPending: isDeleting } = useDeleteAnnouncement(sessionId)

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[#E0E2E6] bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Avatar size="lg">
            <AvatarImage src={getAssetUrl(announcement.author.avatar)} />
            <AvatarFallback>
              {announcement.author.firstname[0]}
              {announcement.author.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">
                {announcement.author.firstname} {announcement.author.lastname}
              </span>
              <span className="text-sm text-[#6B7280]">
                {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isAuthor && (
            <>
              <AnnouncementModal sessionId={sessionId} announcement={announcement} />
              <ConfirmModal
                name="announcement"
                type="delete"
                title="Delete Announcement"
                description="Are you sure you want to delete this Announcement ?"
                handleConfirm={() => handleDelete(announcement.id)}
                buttonClassName="border-none"
                isLoading={isDeleting}
              />
            </>
          )}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <RichTextContent html={announcement.content} />
        {announcement.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {announcement.attachments.map((attachment) => (
              <button
                key={attachment.id}
                type="button"
                onClick={() =>
                  handleDownload(
                    `/announcements/${announcement.id}/attachments/${attachment.id}/url`
                  )
                }
                className="rounded-full border border-[#E0E2E6] bg-[#F9FAFB] px-3 py-1 text-xs text-[#374151] hover:border-[#2563EB]"
              >
                {attachment.fileName} {formatFileSize(attachment.fileSize)}
              </button>
            ))}
          </div>
        )}
      </div>
      <CommentThread
        comments={announcement.comments}
        onSubmit={(text) => handleCreateComment({ announcementId: announcement.id, content: text })}
        onUpdate={(commentId, content) => handleUpdateComment({ commentId, content })}
        onDelete={handleDeleteComment}
        isDeleting={isDeletingComment}
      />
    </div>
  )
}

export default AnnouncementCard
