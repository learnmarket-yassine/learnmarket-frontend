import useGetSessionAnnouncements from '../../hooks/useGetSessionAnnouncements'
import useGetAssignment from '../../hooks/useGetAssignment'
import AnnouncementCard from './AnnouncementCard'
import AssignmentCard from './AssignmentCard'
import AnnouncementModal from './AnnouncementModal'
import AssignmentModal from './AssignmentModal'

interface ClassroomFeedProps {
  sessionId: string
  isTutor: boolean
}

type FeedItem =
  | { key: string; createdAt: string; kind: 'announcement'; render: () => React.ReactNode }
  | { key: string; createdAt: string; kind: 'assignment'; render: () => React.ReactNode }

const ClassroomFeed = ({ sessionId, isTutor }: ClassroomFeedProps) => {
  const { data: announcements, isLoading: isLoadingAnnouncements } =
    useGetSessionAnnouncements(sessionId)
  const { data: assignmentResponse, isLoading: isLoadingAssignment } = useGetAssignment(sessionId)

  const isLoading = isLoadingAnnouncements || isLoadingAssignment
  const assignment = assignmentResponse?.exists ? assignmentResponse : null

  const feedItems: FeedItem[] = [
    ...(announcements ?? []).map((announcement) => ({
      key: `announcement-${announcement.id}`,
      createdAt: announcement.createdAt,
      kind: 'announcement' as const,
      render: () => <AnnouncementCard sessionId={sessionId} announcement={announcement} />,
    })),
    ...(assignment
      ? [
          {
            key: `assignment-${assignment.id}`,
            createdAt: assignment.createdAt,
            kind: 'assignment' as const,
            render: () => (
              <AssignmentCard sessionId={sessionId} isTutor={isTutor} assignment={assignment} />
            ),
          },
        ]
      : []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <AnnouncementModal sessionId={sessionId} />
        {isTutor && !isLoadingAssignment && !assignment && (
          <AssignmentModal sessionId={sessionId} />
        )}
      </div>
      {isLoading && <p className="text-sm text-gray-400">Loading…</p>}
      {!isLoading && feedItems.length === 0 && (
        <p className="text-sm text-gray-400">
          No updates yet for this session — share the first one.
        </p>
      )}
      {feedItems.map((item) => (
        <div key={item.key}>{item.render()}</div>
      ))}
    </div>
  )
}

export default ClassroomFeed
