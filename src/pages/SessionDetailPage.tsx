import { useParams } from 'react-router-dom'
import useGetSessionContext from '@/features/sessions/hooks/useGetSessionContext'
import useGetMeetingDetails from '@/features/sessions/hooks/useGetMeetingDetails'
import SessionRoomDetailsLayout from '@/features/sessions/components/layout/SessionRoomDetailsLayout'
import CustomSessionDetailsTabToggle from '@/features/sessions/components/ui/CustomSessionDetailsToggle'
import { useState } from 'react'
import ClassroomFeed from '@/features/sessions/components/ui/ClassroomFeed'
import AssignmentsTab from '@/features/sessions/components/ui/AssignmentsTab'
import SessionTutorSummary from '@/features/sessions/components/ui/SessionTutorSummary'
import LearnerResponsePanel from '@/features/sessions/components/ui/LearnerResponsePanel'
import Loader from '@/components/ui/Loader/Loader'

const SessionDetailPage = () => {
  const { proposalId, sessionId } = useParams<{
    proposalId: string
    sessionId: string
  }>()
  const [selectedStep, setSelectedStep] = useState(1)

  const { data: context, isLoading: isContextLoading } = useGetSessionContext(sessionId)

  const { data: meeting, isLoading: isMeetingLoading } = useGetMeetingDetails(sessionId)

  if (!proposalId || !sessionId) {
    return null
  }

  if (isContextLoading || isMeetingLoading || !context || !meeting) {
    return <Loader className="h-4 w-4 animate-spin" />
  }

  const steps = [
    {
      stepNumber: 1,
      component: <ClassroomFeed sessionId={sessionId} />,
      show: true,
      name: 'Session announcement',
      enabled: true,
    },
    {
      stepNumber: 2,
      component: <AssignmentsTab sessionId={sessionId} isTutor={context.isTutor} />,
      show: true,
      name: 'Session announcement',
      enabled: true,
    },
    {
      stepNumber: 3,
      component: context.isTutor ? (
        <SessionTutorSummary sessionId={sessionId} context={context} />
      ) : (
        <LearnerResponsePanel sessionId={sessionId} context={context} />
      ),
      show: true,
      name: 'Session Feedback',
      enabled: context.status === 'PENDING_REVIEW',
    },
  ]

  const visibleSteps = steps.filter((step) => step.show)
  const currentStep = visibleSteps.find((step) => step.stepNumber === selectedStep)

  return (
    <SessionRoomDetailsLayout
      sessionId={sessionId}
      proposalId={proposalId}
      context={context}
      meeting={meeting}
    >
      <div className="space-y-10">
        <div className="flex items-center border-b-[1px] border-[#E0E2E6]">
          <CustomSessionDetailsTabToggle
            steps={steps}
            selected={selectedStep}
            setSelected={setSelectedStep}
          />
        </div>
        <div className="flex-1">{currentStep?.component || null}</div>
      </div>
    </SessionRoomDetailsLayout>
  )
}

export default SessionDetailPage
