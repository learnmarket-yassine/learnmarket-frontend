import { useMemo } from 'react'
import { CalendarClock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/features/myProfile/components/ui/EmptyState'
import useGetMyBookings from '../../hooks/useGetMyBookings'
import MyBookingCard from './MyBookingCard'
import { SessionsTabKey } from '@/pages/SessionsPage'

const EMPTY_STATE_COPY: Record<SessionsTabKey, string> = {
  UPCOMING: 'No scheduled sessions yet.',
  PAST: 'No session history yet.',
}

const MyBookingsList = ({ tab }: { tab: SessionsTabKey }) => {
  const now = useMemo(() => new Date().toISOString(), [])
  const params = useMemo(() => (tab === 'UPCOMING' ? { from: now } : { to: now }), [tab, now])
  const { data, isLoading, isError } = useGetMyBookings(params)
  const bookings = data ?? []

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError) {
    return <EmptyState message="Something went wrong while loading your sessions." />
  }

  if (bookings.length === 0) {
    return <EmptyState icon={CalendarClock} message={EMPTY_STATE_COPY[tab]} />
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <MyBookingCard booking={booking} isUpcoming={tab === 'UPCOMING'} />
      ))}
    </div>
  )
}

export default MyBookingsList
