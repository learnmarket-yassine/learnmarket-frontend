import useGetAssignment from '../../hooks/useGetAssignment'
import AssignmentCard from './AssignmentCard'
import AssignmentModal from './AssignmentModal'
import { EmptyPage } from './EmptyPage'

interface AssignmentsTabProps {
  sessionId: string
  isTutor: boolean
}

const AssignmentsTab = ({ sessionId, isTutor }: AssignmentsTabProps) => {
  const { data: assignmentResponse, isLoading } = useGetAssignment(sessionId)
  const assignment = assignmentResponse?.exists ? assignmentResponse : null

  if (isLoading) return <p className="text-sm text-gray-400">Loading…</p>

  if (assignment) {
    return <AssignmentCard sessionId={sessionId} isTutor={isTutor} assignment={assignment} />
  }

  return (
    <EmptyPage
      description="There are no assignments for this session."
      actionButton={isTutor && <AssignmentModal sessionId={sessionId} />}
    />
  )
}

export default AssignmentsTab
