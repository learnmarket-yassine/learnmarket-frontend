import { useRef } from 'react'
import { Download, Paperclip, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/store'
import useSessionAttachments from '../../hooks/useSessionAttachments'
import useUploadSessionAttachment from '../../hooks/useUploadSessionAttachment'
import useDeleteSessionAttachment from '../../hooks/useDeleteSessionAttachment'
import useDownloadSessionAttachment from '../../hooks/useDownloadSessionAttachment'

function formatFileSize(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface SessionAttachmentsProps {
  sessionId: string
}

const SessionAttachments = ({ sessionId }: SessionAttachmentsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currentUserId = useStore((state) => state.auth.user?.id)

  const { data: attachments, isLoading } = useSessionAttachments(sessionId)
  const { handleUpload, isPending: isUploading } = useUploadSessionAttachment(sessionId)
  const { handleDelete } = useDeleteSessionAttachment(sessionId)
  const { handleDownload } = useDownloadSessionAttachment(sessionId)

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await handleUpload(file)
    } finally {
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E0E2E6] bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1E293B]">Shared files</h3>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={onFileSelected}
          disabled={isUploading}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="size-3.5" />
          {isUploading ? 'Uploading…' : 'Upload'}
        </Button>
      </div>

      {isLoading && <p className="text-xs text-gray-400">Loading files…</p>}

      {!isLoading && attachments?.length === 0 && (
        <p className="text-xs text-gray-400">No files shared yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {attachments?.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#E0E2E6] bg-[#F9FAFB] px-4 py-2.5"
          >
            <button
              type="button"
              onClick={() => handleDownload(attachment.id)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <Paperclip className="size-4 shrink-0 text-gray-400" />
              <span className="truncate text-sm font-medium text-[#1E293B]">
                {attachment.fileName}
              </span>
              <span className="shrink-0 text-xs text-gray-400">
                {formatFileSize(attachment.fileSize)}
              </span>
            </button>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-gray-400">{attachment.uploader.firstname}</span>
              <button
                type="button"
                onClick={() => handleDownload(attachment.id)}
                aria-label="Download"
                className="text-gray-400 hover:text-[#2563EB]"
              >
                <Download className="size-4" />
              </button>
              {attachment.uploaderId === currentUserId && (
                <button
                  type="button"
                  onClick={() => handleDelete(attachment.id)}
                  aria-label="Delete"
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SessionAttachments
