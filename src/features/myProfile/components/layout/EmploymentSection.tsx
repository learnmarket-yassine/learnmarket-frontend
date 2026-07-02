import { TutorProfile } from '../../store/types'
import AddButton from '../ui/AddButton'
import EmploymentItem from '../ui/EmploymentItem'

interface EmploymentSectionProps {
  employment: TutorProfile['employment']
}

function EmploymentSection({ employment }: EmploymentSectionProps) {
  return (
    <div className="space-y-8 rounded-lg border border-[#D1D5DA] p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#143681]">Employment history</h2>
        <AddButton label="Add employment" />
      </div>

      <div className="space-y-6 divide-y divide-[#D1D5DA] divide-border">
        {employment.map((job) => (
          <EmploymentItem key={job.id} {...job} />
        ))}
      </div>
    </div>
  )
}
export default EmploymentSection
