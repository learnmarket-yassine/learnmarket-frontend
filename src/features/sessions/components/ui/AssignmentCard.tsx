import { useRef, useState } from 'react'
import { Download, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Assignment } from '@/features/scheduling/types/dto'
import useUploadSubmissionAttachment from '../../hooks/useUploadSubmissionAttachment'
import useDeleteSubmissionAttachment from '../../hooks/useDeleteSubmissionAttachment'
import useCompleteSubmission from '../../hooks/useCompleteSubmission'
import useExcuseSubmission from '../../hooks/useExcuseSubmission'
import useCreateAssignmentComment from '../../hooks/useCreateAssignmentComment'
import useDownloadClassroomAttachment from '../../hooks/useDownloadClassroomAttachment'
import { formatFileSize } from '../../utils/formatFileSize'
import CommentThread from './CommentThread'
import AssignmentStatusBadge from './AssignmentStatusBadge'
import CreateAssignmentPanel from './CreateAssignmentPanel'

interface AssignmentCardProps {
  sessionId: string
  isTutor: boolean
  assignment: Assignment
}

const AssignmentCard = ({ sessionId, isTutor, assignment }: AssignmentCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { handleDownload } = useDownloadClassroomAttachment()
  const { handleUpload, isPending: isUploading } = useUploadSubmissionAttachment(
    sessionId,
    assignment.id
  )
  const { handleDelete } = useDeleteSubmissionAttachment(sessionId, assignment.id)
  const { handleComplete, isPending: isCompleting } = useCompleteSubmission(
    sessionId,
    assignment.id
  )
  const { handleExcuse, isPending: isExcusing } = useExcuseSubmission(sessionId, assignment.id)
  const { handleCreateComment } = useCreateAssignmentComment(sessionId, assignment.id)

  const isAssigned = assignment.submission.status === 'ASSIGNED'
  const canUpload = isAssigned

  const handleFiles = async (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      await handleUpload(file)
    }
  }

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await handleFiles(e.target.files)
    e.target.value = ''
  }

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) await handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[#E0E2E6] bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-[#1E293B]">{assignment.title}</h3>
            <AssignmentStatusBadge status={assignment.displayStatus} />
          </div>
          {assignment.dueAt && (
            <p className="mt-1 text-xs text-gray-500">
              Due{' '}
              {new Date(assignment.dueAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
        {isTutor && (
          <div className="flex flex-col items-end gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!isAssigned}
              onClick={() => setIsEditOpen(true)}
            >
              Edit
            </Button>
            {!isAssigned && (
              <span className="text-[10px] text-gray-400">Can't be edited after submission</span>
            )}
          </div>
        )}
      </div>

      {assignment.instructions && (
        <p className="whitespace-pre-wrap break-words text-sm text-[#374151]">
          {assignment.instructions}
        </p>
      )}

      {assignment.attachments.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-500">Reference materials</p>
          <div className="flex flex-wrap gap-2">
            {assignment.attachments.map((attachment) => (
              <button
                key={attachment.id}
                type="button"
                onClick={() =>
                  handleDownload(`/assignments/${assignment.id}/attachments/${attachment.id}/url`)
                }
                className="flex items-center gap-1 rounded-full border border-[#E0E2E6] bg-[#F9FAFB] px-3 py-1 text-xs text-[#374151] hover:border-[#2563EB]"
              >
                <Download className="size-3" />
                {attachment.fileName} {formatFileSize(attachment.fileSize)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-gray-500">
          {isTutor ? "Learner's submission" : 'Your submission'}
        </p>

        {!isTutor && canUpload && (
          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors',
              isDragging ? 'border-[#2563EB]' : 'border-[#D1D5DB]'
            )}
          >
            <Upload className="size-6 text-gray-400" />
            <p className="text-xs text-gray-500">
              {isUploading ? 'Uploading…' : 'Drag & drop files here, or click to upload'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={onFileInputChange}
              disabled={isUploading}
            />
          </div>
        )}

        {assignment.submission.attachments.length === 0 && (
          <p className="text-xs text-gray-400">No files submitted yet.</p>
        )}

        <div className="flex flex-col gap-2">
          {assignment.submission.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#E0E2E6] bg-[#F9FAFB] px-4 py-2.5"
            >
              <button
                type="button"
                onClick={() =>
                  handleDownload(
                    `/assignments/${assignment.id}/submission/attachments/${attachment.id}/url`
                  )
                }
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span className="truncate text-sm font-medium text-[#1E293B]">
                  {attachment.fileName}
                </span>
                <span className="shrink-0 text-xs text-gray-400">
                  {formatFileSize(attachment.fileSize)}
                </span>
              </button>
              <div className="flex shrink-0 items-center gap-2">
                {isTutor && (
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        `/assignments/${assignment.id}/submission/attachments/${attachment.id}/url`
                      )
                    }
                    aria-label="Download"
                    className="text-gray-400 hover:text-[#2563EB]"
                  >
                    <Download className="size-4" />
                  </button>
                )}
                {!isTutor && canUpload && (
                  <button
                    type="button"
                    onClick={() => handleDelete(attachment.id)}
                    aria-label="Remove"
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isTutor && (
          <Button
            type="button"
            onClick={() => handleComplete()}
            disabled={!canUpload || isCompleting}
            className="mt-2 w-fit rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCompleting ? 'Marking…' : 'Mark as done'}
          </Button>
        )}

        {isTutor && assignment.submission.status !== 'SUBMITTED' && (
          <button
            type="button"
            onClick={() => handleExcuse()}
            disabled={isExcusing}
            className="mt-2 w-fit text-xs font-medium text-[#6B7280] underline hover:text-[#374151]"
          >
            Excuse from this assignment
          </button>
        )}
      </div>

      <div className="border-t border-[#E0E2E6] pt-4">
        <CommentThread comments={assignment.comments} onSubmit={handleCreateComment} />
      </div>

      {isTutor && (
        <CreateAssignmentPanel
          sessionId={sessionId}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          assignment={assignment}
        />
      )}
    </div>
  )
}

export default AssignmentCard
