import { useState } from 'react'
import { CalendarIcon, Clock } from 'lucide-react'
import { formatDateLabel, formatSlotTime } from '../../../scheduling/utils/time'
import { getBrowserTimezone } from '../../../scheduling/utils/timezones'
import useGetSessionContext from '../../hooks/useGetSessionContext'
import useGetMeetingDetails from '../../hooks/useGetMeetingDetails'
import useGetAssignment from '../../hooks/useGetAssignment'
import { useSessionSocketConnection } from '../../hooks/useSessionSocketConnection'
import ClassroomFeed from './ClassroomFeed'
import AssignmentCard from './AssignmentCard'
import ProposalSessionObjective from '@/features/proposal/components/ui/ProposalSessionObjective'
import SessionZoom from './SessionZoom'
import RescheduleSessionAction from './RescheduleSessionAction'

interface SessionRoomDetailsProps {
  sessionId: string
  proposalId: string
}

const SessionRoomDetails = ({ sessionId, proposalId }: SessionRoomDetailsProps) => {
  useSessionSocketConnection()
  const { data: context, isLoading: isContextLoading } = useGetSessionContext(sessionId)
  const { data: meeting, isLoading: isMeetingLoading } = useGetMeetingDetails(sessionId)
  const { data: assignmentResponse } = useGetAssignment(sessionId)
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false)

  const timezone = getBrowserTimezone()

  if (isContextLoading || isMeetingLoading || !context || !meeting) {
    return <div className="p-6 text-sm text-gray-500">Loading session…</div>
  }

  if (isAssignmentOpen && assignmentResponse?.exists) {
    return (
      <AssignmentCard
        sessionId={sessionId}
        isTutor={context.isTutor}
        assignment={assignmentResponse}
        onBack={() => setIsAssignmentOpen(false)}
      />
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{context.title}</h2>
          {context.booking && (
            <div className="flex items-center gap-3">
              <RescheduleSessionAction
                sessionId={sessionId}
                proposalId={proposalId}
                bookingId={context.booking.id}
                bookingStatus={context.booking.status}
                startTime={context.booking.startTime}
              />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[#1a46a7]">
                  <CalendarIcon className="h-4 w-4" />
                  <p> {formatDateLabel(context.booking.startTime, timezone)}</p>
                </div>
                <div className="flex items-center gap-2 text-[#1a46a7]">
                  <Clock className="h-4 w-4" />
                  <p>
                    {' '}
                    {formatSlotTime(context.booking.startTime, timezone)} -{' '}
                    {formatSlotTime(context.booking.endTime, timezone)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <ProposalSessionObjective className="text-base font-medium" objective={context.objective} />
      </div>
      <div className="space-y-8">
        <SessionZoom context={context} meeting={meeting} sessionId={sessionId} />
        <ClassroomFeed
          sessionId={sessionId}
          isTutor={context.isTutor}
          tutor={context.tutor}
          onOpenAssignment={() => setIsAssignmentOpen(true)}
        />
      </div>
    </div>
  )
}

export default SessionRoomDetails
