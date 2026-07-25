import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import type { DateClickArg } from '@fullcalendar/interaction'
import type { EventContentArg } from '@fullcalendar/core'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { isBefore, startOfDay } from 'date-fns'
import { Pencil, Trash } from 'lucide-react'
import { useMemo, useState } from 'react'
import './DateOverrides.css'
import DateDetailsModal from './DateDetailsModal'
import useAvailabilityExceptions from '../../hooks/useGetAvailabilityExceptions'
import useDeleteAvailabilityException from '../../hooks/useDeleteAvailabilityExceptions'
import useGetAvailabilityRules from '../../hooks/useGetAvailabilityRules'
import useGetTutorBookings from '../../hooks/useGetTutorBookings'
import type { AvailabilityException, TutorBooking } from '../../types/dto'
import { formatTimeRange } from '../../utils/time'
import {
  bookingToEvent,
  computeBusinessHours,
  exceptionToEvent,
  roundToNearest30,
} from './dateOverridesUtils'
import ConfirmModal from '@/components/layout/ConfirmModal'

export interface DateOverridesProps {
  timezone: string
  onConflict: (error: unknown) => boolean
}

const EVENT_LABELS: Record<AvailabilityException['type'], string> = {
  BLOCKED: 'Blocked',
  ADDED: 'Extra Hours',
}

const LEGEND_ITEMS = [
  { label: 'Open', swatchClassName: 'date-overrides-legend-open' },
  { label: 'Recurring', swatchClassName: 'date-overrides-legend-recurring' },
  { label: 'Extra Hours', swatchClassName: 'date-overrides-legend-extra' },
  { label: 'Blocked', swatchClassName: 'date-overrides-legend-blocked' },
  { label: 'Booked', swatchClassName: 'date-overrides-legend-booked' },
] as const

const DateOverrides = ({ timezone, onConflict }: DateOverridesProps) => {
  const exceptionsQuery = useAvailabilityExceptions()
  const rulesQuery = useGetAvailabilityRules()
  const bookingsQuery = useGetTutorBookings()
  const { handleDeleteAvailabilityException, isPending: deleteAvailabilityExceptionPending } =
    useDeleteAvailabilityException()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [initialEditingId, setInitialEditingId] = useState<string | null>(null)
  const [initialStart, setInitialStart] = useState<number | undefined>(undefined)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const businessHours = useMemo(
    () => computeBusinessHours(rulesQuery.data ?? []),
    [rulesQuery.data]
  )

  const events = useMemo(
    () => [
      ...(exceptionsQuery.data ?? []).map(exceptionToEvent),
      ...(bookingsQuery.data ?? []).map(bookingToEvent),
    ],
    [exceptionsQuery.data, bookingsQuery.data]
  )

  const openEditException = (exception: AvailabilityException) => {
    setInitialEditingId(exception.id)
    setInitialStart(undefined)
    setSelectedDate(new Date(`${exception.date.slice(0, 10)}T00:00:00`))
  }

  const pendingDeleteException =
    (exceptionsQuery.data ?? []).find((e) => e.id === pendingDeleteId) ?? null

  const confirmDelete = async () => {
    if (!pendingDeleteException) return
    const deletedId = pendingDeleteException.id
    await handleDeleteAvailabilityException(deletedId)
    setPendingDeleteId(null)
  }

  if (exceptionsQuery.isPending || rulesQuery.isPending || bookingsQuery.isPending) {
    return <Skeleton className="h-80 w-full" />
  }

  if (exceptionsQuery.isError || rulesQuery.isError || bookingsQuery.isError) {
    return <p className="py-4 text-sm text-destructive">Couldn't load date overrides.</p>
  }

  const today = startOfDay(new Date())

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="date-overrides-calendar">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
          height="auto"
          allDaySlot={false}
          nowIndicator
          businessHours={businessHours}
          events={events}
          validRange={{ start: today }}
          navLinks
          navLinkDayClick={(date: Date) => {
            if (isBefore(startOfDay(date), today)) return
            setInitialEditingId(null)
            setInitialStart(undefined)
            setSelectedDate(date)
          }}
          dateClick={(arg: DateClickArg) => {
            if (isBefore(startOfDay(arg.date), today)) return
            setInitialEditingId(null)
            setInitialStart(roundToNearest30(arg.date))
            setSelectedDate(arg.date)
          }}
          eventContent={(arg: EventContentArg) => {
            const booking = arg.event.extendedProps.booking as TutorBooking | undefined
            if (booking) {
              const learnerName = arg.event.extendedProps.learnerName as string
              return (
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Booked</span>
                  <span>{learnerName}</span>
                  {booking.session && <span>{booking.session.title}</span>}
                </div>
              )
            }

            const exception = arg.event.extendedProps.exception as AvailabilityException | undefined
            if (!exception) return null
            const isCustomRange = exception.startTime !== null && exception.endTime !== null
            const label = EVENT_LABELS[exception.type]
            return (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{label}</span>
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${label.toLowerCase()} override`}
                      onClick={(event) => {
                        event.stopPropagation()
                        openEditException(exception)
                      }}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${label.toLowerCase()} override`}
                      onClick={(event) => {
                        event.stopPropagation()
                        setPendingDeleteId(exception.id)
                      }}
                    >
                      <Trash size={12} />
                    </button>
                  </span>
                </div>
                {isCustomRange && (
                  <span className="flex items-center justify-center">
                    {formatTimeRange(exception.startTime as number, exception.endTime as number)}
                  </span>
                )}
              </div>
            )
          }}
        />
      </div>
      <div className="date-overrides-legend">
        {LEGEND_ITEMS.map((item) => (
          <span key={item.label} className="date-overrides-legend-item">
            <span className={cn('date-overrides-legend-swatch', item.swatchClassName)} />
            {item.label}
          </span>
        ))}
      </div>
      <DateDetailsModal
        date={selectedDate}
        exceptions={exceptionsQuery.data}
        timezone={timezone}
        onConflict={onConflict}
        onClose={() => setSelectedDate(null)}
        initialEditingId={initialEditingId}
        initialStart={initialStart}
      />
      <ConfirmModal
        name="Event Exception Modal"
        type="delete"
        title={
          pendingDeleteException
            ? `Delete ${EVENT_LABELS[pendingDeleteException.type].toLowerCase()} override`
            : 'Delete override'
        }
        description="Are you sure you want to delete this override?"
        isOpen={pendingDeleteId !== null}
        setIsOpen={(next) => setPendingDeleteId(next ? pendingDeleteId : null)}
        handleConfirm={confirmDelete}
        buttonClassName="border-none"
        isLoading={deleteAvailabilityExceptionPending}
      />
    </div>
  )
}

export default DateOverrides
