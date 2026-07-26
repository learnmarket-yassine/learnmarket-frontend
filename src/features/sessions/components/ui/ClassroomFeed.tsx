import { useRef, useState } from 'react'
import { Paperclip, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/store/store'
import { getAssetUrl } from '@/lib/utils'
import useGetSessionAnnouncements from '../../hooks/useGetSessionAnnouncements'
import useCreateAnnouncement from '../../hooks/useCreateAnnouncement'
import useGetAssignment from '../../hooks/useGetAssignment'
import AnnouncementCard from './AnnouncementCard'
import AssignmentCard from './AssignmentCard'
import CreateAssignmentPanel from './CreateAssignmentPanel'

interface ClassroomFeedProps {
  sessionId: string
  isTutor: boolean
}

type FeedItem =
  | { key: string; createdAt: string; kind: 'announcement'; render: () => React.ReactNode }
  | { key: string; createdAt: string; kind: 'assignment'; render: () => React.ReactNode }

const ClassroomFeed = ({ sessionId, isTutor }: ClassroomFeedProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currentUser = useStore((state) => state.auth.user)
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false)

  const { data: announcements, isLoading: isLoadingAnnouncements } =
    useGetSessionAnnouncements(sessionId)
  const { data: assignmentResponse, isLoading: isLoadingAssignment } = useGetAssignment(sessionId)
  const { handleCreate, isPending: isPosting } = useCreateAnnouncement(sessionId)

  const isLoading = isLoadingAnnouncements || isLoadingAssignment
  const assignment = assignmentResponse?.exists ? assignmentResponse : null

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length > 0) setFiles((prev) => [...prev, ...selected])
    e.target.value = ''
  }

  const handlePost = async () => {
    if (!content.trim()) return
    await handleCreate({ content: content.trim(), files })
    setContent('')
    setFiles([])
  }

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
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E0E2E6] bg-white p-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={getAssetUrl(currentUser?.avatar)} />
            <AvatarFallback>
              {currentUser?.firstname?.[0]}
              {currentUser?.lastname?.[0]}
            </AvatarFallback>
          </Avatar>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update with the class…"
            className="rounded-full"
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={onFilesSelected}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach a file"
            className="shrink-0 text-gray-400 hover:text-[#2563EB]"
          >
            <Paperclip className="size-5" />
          </button>
          <button
            type="button"
            onClick={handlePost}
            disabled={!content.trim() || isPosting}
            className="flex shrink-0 items-center gap-1 rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="size-3.5" />
            Post
          </button>
        </div>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-[52px]">
            {files.map((file, idx) => (
              <span
                key={`${file.name}-${idx}`}
                className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs text-[#374151]"
              >
                {file.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {isTutor && !isLoadingAssignment && !assignment && (
        <div className="flex items-center justify-between rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-4">
          <p className="text-sm text-gray-500">No assignment has been posted for this session.</p>
          <Button
            type="button"
            size="sm"
            onClick={() => setIsCreateAssignmentOpen(true)}
            className="rounded-full bg-[#2563EB] px-4 font-semibold text-white hover:bg-[#2563EB]"
          >
            + Create Assignment
          </Button>
        </div>
      )}
      {isTutor && (
        <CreateAssignmentPanel
          sessionId={sessionId}
          isOpen={isCreateAssignmentOpen}
          setIsOpen={setIsCreateAssignmentOpen}
        />
      )}

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
