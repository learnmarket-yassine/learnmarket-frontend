import { Button } from '@/components/ui/button'
import { MyBooking } from '../../types/dto'
import { formatDateLabel, formatSlotTime } from '../../utils/time'
import { useNavigate } from 'react-router-dom'
import { Video } from 'lucide-react'
import RescheduleSessionAction from '@/features/sessions/components/ui/RescheduleSessionAction'

type BookingProps = {
  booking: MyBooking
  isUpcoming?: boolean
}

const LOCAL_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

function counterpartName(booking: MyBooking): string {
  const counterpart = booking.tutor ?? booking.learner
  return counterpart ? `${counterpart.firstname} ${counterpart.lastname}` : 'Unknown'
}

function requestDetailsPath(booking: MyBooking): string | null {
  if (booking.session?.proposalId) return `/requests/${booking.session.proposalId}`
  if (booking.session?.proposal?.learnRequestId) {
    return `/learn-requests/${booking.session.proposal.learnRequestId}`
  }
  return null
}

const MyBookingCard: React.FC<BookingProps> = ({ booking, isUpcoming = false }) => {
  const navigate = useNavigate()
  const joinPath = requestDetailsPath(booking)
  return (
    <div
      key={booking.id}
      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#143681] hover:shadow-lg"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="truncate text-base font-semibold text-[#143681]">
            {booking.session?.title ?? 'Session'}
          </h2>
          <div className="flex items-center gap-2">
            {booking.sessionId && (
              <RescheduleSessionAction
                sessionId={booking.sessionId}
                bookingId={booking.id}
                bookingStatus="CONFIRMED"
                startTime={booking.startTime}
                className="whitespace-nowrap rounded-full border-[#2563EB] bg-white px-6 py-4 font-medium text-[#2563EB] hover:bg-blue-50 hover:text-[#2563EB]/90"
              />
            )}

            {isUpcoming && booking.sessionId && joinPath && (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(joinPath)
                }}
                className="flex h-full items-center gap-3 whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-4 font-medium text-white hover:bg-[#113991] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Video className="size-5" />
                Join Session room
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm font-bold">
          {formatDateLabel(booking.startTime, LOCAL_TIMEZONE)} ·{' '}
          {formatSlotTime(booking.startTime, LOCAL_TIMEZONE)} -{' '}
          {formatSlotTime(booking.endTime, LOCAL_TIMEZONE)}
        </p>
        <p className="text-sm">with {counterpartName(booking)}</p>
      </div>
    </div>
  )
}

export default MyBookingCard
