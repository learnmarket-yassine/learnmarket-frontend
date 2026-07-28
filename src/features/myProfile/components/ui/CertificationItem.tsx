import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FileText } from 'lucide-react'
import ConfirmModal from '@/components/layout/ConfirmModal'
import useDownloadClassroomAttachment from '@/features/sessions/hooks/useDownloadClassroomAttachment'
import { Certification } from '../../store/types'
import useDeleteCertification from '../../hooks/useDeleteCertification'
import CertificationForm from './CertificationForm'

type CertificationItemProps = Certification

function CertificationItem({
  id,
  title,
  issuer,
  issuedAt,
  expiresAt,
  credentialUrl,
  files,
}: CertificationItemProps) {
  const { handleDeleteCertification, isPending: isDeletingCertification } = useDeleteCertification()
  const { handleDownload } = useDownloadClassroomAttachment()

  return (
    <div className="space-y-4 py-8">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xl font-semibold text-[#143681]">{title}</p>
          <p className="text-base text-[#143681]">{issuer}</p>
          {(issuedAt || expiresAt) && (
            <p className="text-sm text-muted-foreground">
              {issuedAt && format(issuedAt, 'PPP', { locale: fr })}
              {issuedAt && expiresAt && ' — '}
              {expiresAt && format(expiresAt, 'PPP', { locale: fr })}
            </p>
          )}
          {credentialUrl && (
            <a
              href={credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-[#225AD6] underline underline-offset-2"
            >
              View credential
            </a>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <CertificationForm id={id} edit />
          <ConfirmModal
            name="certification"
            type="delete"
            title="Delete certification"
            description="Are you sure you want to delete this certification?"
            handleConfirm={() => handleDeleteCertification(id)}
            buttonClassName="border-none"
            isLoading={isDeletingCertification}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => handleDownload(`/tutor/certifications/${id}/files/${file.id}/url`)}
              className="flex items-center gap-2 rounded-full border border-[#E0E2E6] bg-[#F9FAFB] px-3 py-1.5 text-sm font-medium text-[#1E293B] hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              <FileText className="size-4 shrink-0" aria-hidden="true" />
              <span className="max-w-[200px] truncate">
                {file.fileName ?? 'Certification file'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CertificationItem
