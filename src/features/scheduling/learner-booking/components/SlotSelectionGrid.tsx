import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { addDays, format, startOfDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { SlotHold } from '../../types/dto'
import { isSlotTakenError } from '../../utils/errors'
import { formatDateLabel, formatSlotTime } from '../../utils/time'
import { getBrowserTimezone } from '../../utils/timezones'
import { useAvailableSlots } from '../hooks/useAvailableSlots'
import { useCreateHold } from '../hooks/useSlotHold'

const WINDOW_DAYS = 21

interface SlotSelectionGridProps {
  tutorId: string
  sessionId: string
  durationMinutes: number
  onHoldCreated: (hold: SlotHold) => void
}

const SlotSelectionGrid = ({
  tutorId,
  sessionId,
  durationMinutes,
  onHoldCreated,
}: SlotSelectionGridProps) => {
  const [windowStart, setWindowStart] = useState(() => startOfDay(new Date()))
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)
  const [pickError, setPickError] = useState<string | null>(null)
  // Slots seen at any point during the current window stay visible (as "taken") even after
  // they disappear from a refetch, rather than silently vanishing from the grid.
  const [seenState, setSeenState] = useState<{ windowKey: string; seen: Set<string> }>({
    windowKey: '',
    seen: new Set(),
  })
  const learnerTimezone = getBrowserTimezone()

  const fromDate = format(windowStart, 'yyyy-MM-dd')
  const toDate = format(addDays(windowStart, WINDOW_DAYS - 1), 'yyyy-MM-dd')
  const windowKey = `${fromDate}|${toDate}`
  const slotsQuery = useAvailableSlots(tutorId, { fromDate, toDate, durationMinutes })
  const createHold = useCreateHold()

  // Adjusting state in response to a changed prop/query result, computed during render
  // rather than in an effect (React's documented pattern for this).
  let seenSlots = seenState.seen
  if (seenState.windowKey !== windowKey) {
    seenSlots = new Set(slotsQuery.data?.slots ?? [])
    setSeenState({ windowKey, seen: seenSlots })
  } else {
    const latest = slotsQuery.data?.slots ?? []
    if (latest.some((slot) => !seenSlots.has(slot))) {
      seenSlots = new Set(seenSlots)
      for (const slot of latest) seenSlots.add(slot)
      setSeenState({ windowKey, seen: seenSlots })
    }
  }

  if (slotsQuery.isPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>
      </div>
    )
  }

  if (slotsQuery.isError) {
    return <p className="text-sm text-destructive">Couldn&apos;t load available times.</p>
  }

  const currentSlots = new Set(slotsQuery.data?.slots ?? [])
  const allSlots = Array.from(seenSlots).sort()

  const byDate = new Map<string, string[]>()
  for (const slot of allSlots) {
    const key = formatDateLabel(slot, learnerTimezone)
    const bucket = byDate.get(key)
    if (bucket) bucket.push(slot)
    else byDate.set(key, [slot])
  }
  const dateKeys = Array.from(byDate.keys())
  const activeDateKey =
    selectedDateKey && byDate.has(selectedDateKey) ? selectedDateKey : (dateKeys[0] ?? null)
  const activeSlots = activeDateKey ? (byDate.get(activeDateKey) ?? []) : []

  const handlePick = async (slotIso: string) => {
    setPickError(null)
    try {
      const hold = await createHold.mutateAsync({
        sessionId,
        startTime: slotIso,
      })
      onHoldCreated(hold)
    } catch (error) {
      if (isSlotTakenError(error)) {
        slotsQuery.refetch()
      } else {
        setPickError('Something went wrong booking that slot. Please try again.')
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">Times shown in {learnerTimezone}</p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            setWindowStart((current) => addDays(current, -WINDOW_DAYS))
            setSelectedDateKey(null)
          }}
          aria-label="Previous dates"
        >
          <ChevronLeft />
        </Button>

        <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
          {dateKeys.length === 0 && (
            <span className="px-2 text-sm text-muted-foreground">
              No availability in this range
            </span>
          )}
          {dateKeys.map((key) => (
            <Button
              key={key}
              type="button"
              variant={key === activeDateKey ? 'default' : 'outline'}
              size="sm"
              className="shrink-0"
              onClick={() => setSelectedDateKey(key)}
            >
              {key}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            setWindowStart((current) => addDays(current, WINDOW_DAYS))
            setSelectedDateKey(null)
          }}
          aria-label="Next dates"
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeSlots.map((slot) => {
          const isTaken = !currentSlots.has(slot)
          return (
            <Badge
              key={slot}
              asChild={!isTaken}
              variant={isTaken ? 'outline' : 'secondary'}
              className={cn(
                'px-3 py-1.5',
                isTaken ? 'cursor-not-allowed text-muted-foreground line-through' : 'cursor-pointer'
              )}
            >
              {isTaken ? (
                <span>{formatSlotTime(slot, learnerTimezone)} · Just booked</span>
              ) : (
                <button
                  type="button"
                  disabled={createHold.isPending}
                  onClick={() => handlePick(slot)}
                >
                  {formatSlotTime(slot, learnerTimezone)}
                </button>
              )}
            </Badge>
          )
        })}
      </div>

      {pickError && <p className="text-sm text-destructive">{pickError}</p>}
    </div>
  )
}

export default SlotSelectionGrid
