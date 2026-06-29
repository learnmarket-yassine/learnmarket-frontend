import { TutorProfile } from '../../store/types'
import AddButton from '../ui/AddButton'

interface CertificationsSectionProps {
  certifications: TutorProfile['certifications']
}

function CertificationsSection({ certifications }: CertificationsSectionProps) {
  return (
    <div className="rounded-lg border border-[#D1D5DA] p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#143681]">Certifications</h2>
        <AddButton label="Add certification" />
      </div>

      <ul className="mt-4 space-y-4">
        {certifications.map((cert) => (
          <li key={cert.id} className="border-t border-border pt-4">
            <p className="text-sm font-semibold text-foreground">{cert.title}</p>
            <p className="text-xs text-muted-foreground">
              {cert.issuer} · {cert.date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default CertificationsSection
