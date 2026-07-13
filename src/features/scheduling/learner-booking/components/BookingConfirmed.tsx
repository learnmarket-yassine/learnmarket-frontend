import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Booking } from '../../types/dto'
import { formatDateLabel, formatSlotTime } from '../../utils/time'

interface BookingConfirmedProps {
  booking: Booking
  timezone: string
  onDone: () => void
}

const BookingConfirmed = ({ booking, timezone, onDone }: BookingConfirmedProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Booking confirmed</CardTitle>
      <CardDescription>{formatDateLabel(booking.startTime, timezone)}</CardDescription>
    </CardHeader>
    <CardContent>
      <span className="text-sm">
        {formatSlotTime(booking.startTime, timezone)} – {formatSlotTime(booking.endTime, timezone)}
      </span>
    </CardContent>
    <CardFooter>
      <Button onClick={onDone}>Done</Button>
    </CardFooter>
  </Card>
)

export default BookingConfirmed
