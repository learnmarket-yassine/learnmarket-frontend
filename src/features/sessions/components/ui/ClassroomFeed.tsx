import useGetSessionAnnouncements from '../../hooks/useGetSessionAnnouncements'
import AnnouncementCard from './AnnouncementCard'
import AnnouncementModal from './AnnouncementModal'
import { EmptyPage } from './EmptyPage'

interface ClassroomFeedProps {
  sessionId: string
}

const ClassroomFeed = ({ sessionId }: ClassroomFeedProps) => {
  const { data: announcements, isLoading } = useGetSessionAnnouncements(sessionId)
  const ordered = [...(announcements ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  if (isLoading) return <p className="text-sm text-gray-400">Loading…</p>
  if (!isLoading && ordered.length <= 0)
    return (
      <EmptyPage
        description="There are no announcements for this session. Create one to keep everyone informed."
        actionButton={<AnnouncementModal sessionId={sessionId} />}
      />
    )
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <AnnouncementModal sessionId={sessionId} />
      </div>
      {ordered.map((announcement) => (
        <AnnouncementCard key={announcement.id} sessionId={sessionId} announcement={announcement} />
      ))}
    </div>
  )
}

export default ClassroomFeed
