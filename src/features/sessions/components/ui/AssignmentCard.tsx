import { Assignment } from '@/features/scheduling/types/dto'
import useDownloadClassroomAttachment from '../../hooks/useDownloadClassroomAttachment'
import useCreateAssignmentComment from '../../hooks/useCreateAssignmentComment'
import useUpdateAssignmentComment from '../../hooks/useUpdateAssignmentComment'
import useDeleteAssignmentComment from '../../hooks/useDeleteAssignmentComment'
import useDeleteAssignment from '../../hooks/useDeleteAssignment'
import RichTextContent from '@/components/ui/rich-text-content'
import { formatFileSize } from '../../utils/formatFileSize'
import { Download, Trash2 } from 'lucide-react'
import ConfirmModal from '@/components/layout/ConfirmModal'
import AssignmentModal from './AssignmentModal'
import { Button } from '@/components/ui/button'
import useDeleteSubmissionAttachment from '../../hooks/useDeleteSubmissionAttachment'
import useExcuseSubmission from '../../hooks/useExcuseSubmission'
import useCompleteSubmission from '../../hooks/useCompleteSubmission'
import useUploadSubmissionAttachment from '../../hooks/useUploadSubmissionAttachment'
import useDeleteAssignmentAttachment from '../../hooks/useDeleteAssignmentAttachment'
import FileUpload from '@/components/ui/FileUploader'
import CommentThread from './CommentThread'

interface AssignmentCardProps {
  sessionId: string
  isTutor: boolean
  assignment: Assignment
}

const AssignmentCard = ({ sessionId, isTutor, assignment }: AssignmentCardProps) => {
  const { handleDownload } = useDownloadClassroomAttachment()
  const { handleCreateComment } = useCreateAssignmentComment(sessionId, assignment.id)
  const { handleUpdateComment } = useUpdateAssignmentComment(sessionId)
  const { handleDeleteComment, isPending: isDeletingComment } =
    useDeleteAssignmentComment(sessionId)
  const { handleDelete: handleDeleteAssignment, isPending: isDeletingAssignment } =
    useDeleteAssignment(sessionId)

  const { handleExcuse, isPending: isExcusing } = useExcuseSubmission(sessionId, assignment.id)
  const { handleDelete, isPending: isDeletingAttachment } = useDeleteSubmissionAttachment(
    sessionId,
    assignment.id
  )
  const { handleComplete, isPending: isCompleting } = useCompleteSubmission(
    sessionId,
    assignment.id
  )
  const { handleUpload } = useUploadSubmissionAttachment(sessionId, assignment.id)
  const {
    handleDelete: handleDeleteReferenceAttachment,
    isPending: isDeletingReferenceAttachment,
  } = useDeleteAssignmentAttachment(sessionId, assignment.id)

  const isAssigned = assignment.submission.status === 'ASSIGNED'
  const isExcused = assignment.submission.status === 'EXCUSED'
  const canDelete = assignment.submission.attachments.length === 0

  return (
    <div className="space-y-4 divide-y-[0.5px] divide-[#9CA3AF] rounded-lg border-[0.5px] border-[#9CA3AF]">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">{assignment.title}</h2>
          <div className="flex items-center gap-1">
            {isAssigned && <AssignmentModal sessionId={sessionId} assignment={assignment} />}
            {canDelete && (
              <ConfirmModal
                name="assignment"
                type="delete"
                title="Delete assignment"
                description="Are you sure you want to delete this assignment?"
                handleConfirm={() => {
                  handleDeleteAssignment()
                }}
                buttonClassName="border-none"
                isLoading={isDeletingAssignment}
              />
            )}
          </div>
        </div>
        {assignment.dueAt && (
          <p className="text-base font-medium leading-snug">
            Due :{' '}
            {new Date(assignment.dueAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}
        {assignment.instructions && (
          <RichTextContent className="mt-2 max-w-screen-md" html={assignment.instructions} />
        )}
        {assignment.attachments.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-500">Reference materials</p>
            <div className="flex flex-wrap gap-2">
              {assignment.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-1 rounded-full border border-[#E0E2E6] bg-[#F9FAFB] px-3 py-1 text-xs text-[#374151]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        `/assignments/${assignment.id}/attachments/${attachment.id}/url`
                      )
                    }
                    className="flex items-center gap-1 hover:text-[#2563EB]"
                  >
                    <Download className="size-3" />
                    {attachment.fileName} {formatFileSize(attachment.fileSize)}
                  </button>
                  {isTutor && isAssigned && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReferenceAttachment(attachment.id)}
                      disabled={isDeletingReferenceAttachment}
                      aria-label="Remove"
                      className="text-gray-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isExcused && (
        <p className="p-4 text-sm text-purple-700">
          {isTutor
            ? 'You excused the learner from this assignment.'
            : 'You were excused from this assignment.'}
        </p>
      )}

      {!isTutor && isAssigned && (
        <div className="flex flex-col gap-4 p-4">
          <FileUpload
            accept={['application/pdf']}
            maxSizeMB={25}
            resetAfterUpload
            uploadFn={(file) => handleUpload(file)}
          />
        </div>
      )}

      {assignment.submission.attachments.length > 0 && (
        <div className="flex flex-col gap-2 p-4">
          {!isTutor && <p className="text-xs font-semibold text-gray-500">Your submitted files</p>}
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
                {!isTutor && isAssigned && (
                  <button
                    type="button"
                    onClick={() => handleDelete(attachment.id)}
                    disabled={isDeletingAttachment}
                    aria-label="Remove"
                    className="text-gray-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {!isTutor && isAssigned && (
            <div className="flex items-center justify-end p-4">
              <Button
                type="button"
                onClick={() => handleComplete()}
                disabled={!isAssigned || isCompleting}
                className="h-full rounded-full bg-[#2563EB] px-3 py-2 font-medium text-white hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCompleting ? 'Marking…' : 'Mark as done'}
              </Button>
            </div>
          )}
        </div>
      )}

      {isTutor && !isExcused && assignment.submission.status !== 'SUBMITTED' && (
        <div className="flex items-center justify-end p-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleExcuse()}
            disabled={isExcusing}
            className="h-full rounded-full px-3 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExcusing ? 'Excusing…' : 'Excuse learner'}
          </Button>
        </div>
      )}

      <div className="p-4">
        <CommentThread
          comments={assignment.comments}
          onSubmit={handleCreateComment}
          onUpdate={(commentId, content) => handleUpdateComment({ commentId, content })}
          onDelete={handleDeleteComment}
          isDeleting={isDeletingComment}
        />
      </div>
    </div>
  )
}

export default AssignmentCard
