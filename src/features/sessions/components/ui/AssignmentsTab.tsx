import Loader from '@/components/ui/Loader/Loader'
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

  if (isLoading) return <Loader className="h-4 w-4 animate-spin" />

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
