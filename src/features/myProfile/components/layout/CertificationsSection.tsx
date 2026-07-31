import { TutorProfile } from '../../store/types'
import CertificationForm from '../ui/CertificationForm'
import CertificationItem from '../ui/CertificationItem'

interface CertificationsSectionProps {
  certifications: TutorProfile['certifications']
  readOnly?: boolean
}

function CertificationsSection({ certifications, readOnly = false }: CertificationsSectionProps) {
  return (
    <div className="rounded-lg border border-[#D1D5DA] p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#143681]">Certifications</h2>
        {!readOnly && <CertificationForm edit={false} />}
      </div>

      <div className="space-y-4 divide-y divide-[#D1D5DA] divide-border">
        {certifications.map((certification) => (
          <CertificationItem key={certification.id} {...certification} readOnly={readOnly} />
        ))}
      </div>
    </div>
  )
}
export default CertificationsSection
