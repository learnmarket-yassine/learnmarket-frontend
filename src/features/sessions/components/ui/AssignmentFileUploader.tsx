import React, { useRef } from 'react'
import useExcuseSubmission from '../../hooks/useExcuseSubmission'
import useDeleteSubmissionAttachment from '../../hooks/useDeleteSubmissionAttachment'
import useCompleteSubmission from '../../hooks/useCompleteSubmission'
import useUploadSubmissionAttachment from '../../hooks/useUploadSubmissionAttachment'
import { Download, Trash2 } from 'lucide-react'
import { formatFileSize } from '../../utils/formatFileSize'
import { Button } from '@/components/ui/button'
import { Assignment } from '@/features/scheduling/types/dto'
import useDownloadClassroomAttachment from '../../hooks/useDownloadClassroomAttachment'

interface AssignmentFileUploaderProps {
  assignment: Assignment
  sessionId: string
  canUpload: boolean
  isTutor: boolean
}

const AssignmentFileUploader = ({
  assignment,
  sessionId,
  canUpload,
  isTutor,
}: AssignmentFileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { handleDownload } = useDownloadClassroomAttachment()
  const { handleExcuse, isPending: isExcusing } = useExcuseSubmission(sessionId, assignment.id)
  const { handleDelete } = useDeleteSubmissionAttachment(sessionId, assignment.id)
  const { handleComplete, isPending: isCompleting } = useCompleteSubmission(
    sessionId,
    assignment.id
  )
  const { handleUpload, isPending: isUploading } = useUploadSubmissionAttachment(
    sessionId,
    assignment.id
  )

  const handleFiles = async (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      await handleUpload(file)
    }
  }

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await handleFiles(e.target.files)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{isTutor ? "Learner's submission" : 'Your submission'}</p>
        {isTutor && assignment.submission.status !== 'SUBMITTED' && (
          <button
            type="button"
            onClick={() => handleExcuse()}
            disabled={isExcusing}
            className="text-sm font-medium text-[#6B7280] underline hover:text-[#374151]"
          >
            Excuse
          </button>
        )}
      </div>
      {!isTutor && canUpload && (
        <Button
          role="button"
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="h-full rounded-full border-[#2563EB] bg-white px-3 py-2 font-medium text-[#2563EB] hover:bg-blue-50 hover:text-[#2563EB]/90"
        >
          {isUploading ? 'Uploading…' : 'click to upload'}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={onFileInputChange}
            disabled={isUploading}
          />
        </Button>
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
          className="h-full rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCompleting ? 'Marking…' : 'Mark as done'}
        </Button>
      )}
    </div>
  )
}

export default AssignmentFileUploader
