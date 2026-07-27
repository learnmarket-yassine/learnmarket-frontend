import { ArrowLeft, Download } from 'lucide-react'
import { RichTextContent } from '@/components/ui/rich-text-content'
import { Assignment } from '@/features/scheduling/types/dto'
import useCreateAssignmentComment from '../../hooks/useCreateAssignmentComment'
import useUpdateAssignmentComment from '../../hooks/useUpdateAssignmentComment'
import useDeleteAssignmentComment from '../../hooks/useDeleteAssignmentComment'
import useDownloadClassroomAttachment from '../../hooks/useDownloadClassroomAttachment'
import { formatFileSize } from '../../utils/formatFileSize'
import useDeleteAssignment from '../../hooks/useDeleteAssignment'
import CommentThread from './CommentThread'
import AssignmentStatusBadge from './AssignmentStatusBadge'
import AssignmentModal from './AssignmentModal'
import AssignmentFileUploader from './AssignmentFileUploader'
import ConfirmModal from '@/components/layout/ConfirmModal'

interface AssignmentCardProps {
  sessionId: string
  isTutor: boolean
  assignment: Assignment
  onBack?: () => void
}

const AssignmentCard = ({ sessionId, isTutor, assignment, onBack }: AssignmentCardProps) => {
  const { handleDownload } = useDownloadClassroomAttachment()
  const { handleCreateComment } = useCreateAssignmentComment(sessionId, assignment.id)
  const { handleUpdateComment } = useUpdateAssignmentComment(sessionId)
  const { handleDeleteComment, isPending: isDeletingComment } =
    useDeleteAssignmentComment(sessionId)
  const { handleDelete: handleDeleteAssignment, isPending: isDeletingAssignment } =
    useDeleteAssignment(sessionId)
  const isAssigned = assignment.submission.status === 'ASSIGNED'
  const canDelete = assignment.submission.attachments.length === 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex w-fit items-center gap-2 text-base font-bold text-[#1a46a7]"
          >
            <ArrowLeft className="size-5" />
            Back to session
          </button>
        )}
        {isTutor && (
          <div className="flex flex-col items-end gap-1">
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
                    onBack?.()
                  }}
                  buttonClassName="border-none"
                  isLoading={isDeletingAssignment}
                />
              )}
            </div>
            {!isAssigned && (
              <span className="text-[10px] text-gray-400">Can't be edited after submission</span>
            )}
          </div>
        )}
      </div>
      <div className="flex items-start gap-3">
        <div className="flex flex-1 flex-col gap-5 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-[#1E293B]">{assignment.title}</h3>
                <AssignmentStatusBadge status={assignment.displayStatus} />
              </div>
              {assignment.dueAt && (
                <p className="text-sm">
                  Due{' '}
                  {new Date(assignment.dueAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
          {assignment.instructions && <RichTextContent html={assignment.instructions} />}
          {assignment.attachments.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500">Reference materials</p>
              <div className="flex flex-wrap gap-2">
                {assignment.attachments.map((attachment) => (
                  <button
                    key={attachment.id}
                    type="button"
                    onClick={() =>
                      handleDownload(
                        `/assignments/${assignment.id}/attachments/${attachment.id}/url`
                      )
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
          <div>
            <CommentThread
              comments={assignment.comments}
              onSubmit={handleCreateComment}
              onUpdate={(commentId, content) => handleUpdateComment({ commentId, content })}
              onDelete={handleDeleteComment}
              isDeleting={isDeletingComment}
            />
          </div>
        </div>
        <div className="w-80 shrink-0">
          <AssignmentFileUploader
            assignment={assignment}
            sessionId={sessionId}
            canUpload={isAssigned}
            isTutor={isTutor}
          />
        </div>
      </div>
    </div>
  )
}

export default AssignmentCard
