import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAssetUrl } from '@/lib/utils'
import { Announcement } from '@/features/scheduling/types/dto'
import useCreateAnnouncementComment from '../../hooks/useCreateAnnouncementComment'
import useDownloadClassroomAttachment from '../../hooks/useDownloadClassroomAttachment'
import { formatFileSize } from '../../utils/formatFileSize'
import CommentThread from './CommentThread'

interface AnnouncementCardProps {
  sessionId: string
  announcement: Announcement
}

const AnnouncementCard = ({ sessionId, announcement }: AnnouncementCardProps) => {
  const { handleCreateComment } = useCreateAnnouncementComment(sessionId)
  const { handleDownload } = useDownloadClassroomAttachment()

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[#E0E2E6] bg-white p-4">
      <div className="flex items-start gap-3">
        <Avatar size="sm">
          <AvatarImage src={getAssetUrl(announcement.author.avatar)} />
          <AvatarFallback>
            {announcement.author.firstname[0]}
            {announcement.author.lastname[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-[#1E293B]">
              {announcement.author.firstname} {announcement.author.lastname}
            </span>
            <span className="shrink-0 text-xs text-[#6B7280]">
              {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="whitespace-pre-wrap break-words text-sm text-[#374151]">
            {announcement.content}
          </p>
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
      </div>
      <div className="pl-[44px]">
        <CommentThread
          comments={announcement.comments}
          onSubmit={(text) =>
            handleCreateComment({ announcementId: announcement.id, content: text })
          }
        />
      </div>
    </div>
  )
}

export default AnnouncementCard
