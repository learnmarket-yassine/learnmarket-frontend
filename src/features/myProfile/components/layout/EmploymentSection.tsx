import { TutorProfile } from '../../store/types'
import EmploymentForm from '../ui/EmploymentForm'
import EmploymentItem from '../ui/EmploymentItem'

interface EmploymentSectionProps {
  employment: TutorProfile['employment']
  readOnly?: boolean
}

function EmploymentSection({ employment, readOnly = false }: EmploymentSectionProps) {
  return (
    <div className="space-y-8 rounded-lg border border-[#D1D5DA] p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#143681]">Employment history</h2>
        {!readOnly && <EmploymentForm edit={false} />}
      </div>

      <div className="space-y-6 divide-y divide-[#D1D5DA] divide-border">
        {employment.map((job) => (
          <EmploymentItem key={job.id} {...job} readOnly={readOnly} />
        ))}
      </div>
    </div>
  )
}
export default EmploymentSection
