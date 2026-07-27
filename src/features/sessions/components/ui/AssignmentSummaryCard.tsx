import { Assignment } from '@/features/scheduling/types/dto'

interface AssignmentSummaryCardProps {
  assignment: Assignment
  tutor: { firstname: string; lastname: string }
  onClick: () => void
}

const AssignmentSummaryCard = ({ assignment, tutor, onClick }: AssignmentSummaryCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-2xl border border-[#E0E2E6] bg-white p-6 text-left transition-colors hover:border-[#2563EB]"
  >
    <h3 className="text-lg font-bold text-[#1E293B]">
      {tutor.firstname} {tutor.lastname} posted a new assignment : {assignment.title}
    </h3>
  </button>
)

export default AssignmentSummaryCard
