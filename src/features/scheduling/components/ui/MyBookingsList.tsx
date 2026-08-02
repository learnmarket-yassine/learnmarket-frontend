import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/features/myProfile/components/ui/EmptyState'
import useGetMyBookings from '../../hooks/useGetMyBookings'
import MyBookingCard from './MyBookingCard'
import { SessionsTabKey } from '@/pages/MySessionsPage'
import { EmptyPage } from '@/features/sessions/components/ui/EmptyPage'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const EMPTY_STATE_COPY: Record<SessionsTabKey, string> = {
  UPCOMING:
    "You don't have any upcoming sessions. Once a booking is confirmed, it will appear here.",
  PAST: "Your completed and cancelled sessions will appear here once you've attended or finished a booking.",
}

const MyBookingsList = ({ tab }: { tab: SessionsTabKey }) => {
  const navigate = useNavigate()
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
    return (
      <EmptyPage
        description={EMPTY_STATE_COPY[tab]}
        actionButton={
          <Button
            type="button"
            onClick={() => navigate('/accueil')}
            aria-label="Create Announcement"
            className={`h-full border border-[#2563EB] bg-[#2563EB] p-3 text-white hover:bg-[#2563EB]`}
          >
            <span>Go to Accueil</span>
          </Button>
        }
      />
    )
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
