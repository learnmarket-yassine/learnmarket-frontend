import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { endOfMonth, format, startOfDay, startOfMonth } from 'date-fns'
import { useState } from 'react'
import type { SlotHold } from '../../types/dto'
import { isSlotTakenError } from '../../utils/errors'
import { formatDateLabel, formatSlotTime } from '../../utils/time'
import { getBrowserTimezone } from '../../utils/timezones'
import { useAvailableSlots } from '../hooks/useAvailableSlots'
import { useCreateHold } from '../hooks/useCreateHold'

interface SlotSelectionGridProps {
  tutorId: string
  sessionId: string
  durationMinutes: number
  onHoldCreated: (hold: SlotHold) => void
}

const dayKey = (date: Date) => format(startOfDay(date), 'yyyy-MM-dd')
const isFutureSlot = (slot: string) => new Date(slot).getTime() > Date.now()
function useAccumulatedSlots(monthKey: string, latestSlots: string[] | undefined) {
  const [state, setState] = useState<{ monthKey: string; slots: Set<string> }>({
    monthKey,
    slots: new Set(),
  })
  const future = latestSlots?.filter(isFutureSlot)

  if (state.monthKey !== monthKey) {
    const reset = { monthKey, slots: new Set(future ?? []) }
    setState(reset)
    return reset.slots
  }

  if (future && future.some((slot) => !state.slots.has(slot))) {
    const merged = new Set(state.slots)
    for (const slot of future) merged.add(slot)
    setState({ monthKey, slots: merged })
    return merged
  }

  return state.slots
}

const SlotSelectionGrid = ({
  tutorId,
  sessionId,
  durationMinutes,
  onHoldCreated,
}: SlotSelectionGridProps) => {
  const [displayMonth, setDisplayMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [pickError, setPickError] = useState<string | null>(null)
  const learnerTimezone = getBrowserTimezone()

  const fromDate = format(displayMonth, 'yyyy-MM-dd')
  const toDate = format(endOfMonth(displayMonth), 'yyyy-MM-dd')
  const monthKey = `${fromDate}|${toDate}`
  const slotsQuery = useAvailableSlots(tutorId, { fromDate, toDate, durationMinutes })
  const { handleCreateHold, isPending: isCreateHoldPending } = useCreateHold()
  const seenSlots = useAccumulatedSlots(monthKey, slotsQuery.data?.slots)

  if (slotsQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-full" />
          ))}
        </div>
      </div>
    )
  }

  if (slotsQuery.isError) {
    return <p className="text-sm text-destructive">Couldn&apos;t load available times.</p>
  }

  const currentSlots = new Set((slotsQuery.data?.slots ?? []).filter(isFutureSlot))
  const allSlots = Array.from(seenSlots).sort()

  const byDay = new Map<string, { date: Date; slots: string[] }>()
  for (const slot of allSlots) {
    const date = startOfDay(new Date(slot))
    const key = dayKey(date)
    const bucket = byDay.get(key)
    if (bucket) bucket.slots.push(slot)
    else byDay.set(key, { date, slots: [slot] })
  }
  const sortedDayKeys = Array.from(byDay.keys()).sort()
  const availableDates = sortedDayKeys.map((key) => byDay.get(key)!.date)

  const selectedKey = selectedDate ? dayKey(selectedDate) : null
  const activeKey = selectedKey && byDay.has(selectedKey) ? selectedKey : (sortedDayKeys[0] ?? null)
  const activeDay = activeKey ? byDay.get(activeKey) : undefined
  const activeSlots = activeDay?.slots ?? []

  const handlePick = async (slotIso: string) => {
    setPickError(null)
    try {
      const hold = await handleCreateHold({
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
      <p className="text-sm text-[#6B7280]">
        Times shown in <span className="font-medium text-[#1E293B]">{learnerTimezone}</span>
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_400px]">
        <div className="h-full w-full">
          <Calendar
            mode="single"
            month={displayMonth}
            onMonthChange={(month) => {
              setDisplayMonth(startOfMonth(month))
              setSelectedDate(undefined)
            }}
            selected={activeDay?.date}
            onSelect={(date) => date && setSelectedDate(date)}
            disabled={(date) => !byDay.has(dayKey(date))}
            modifiers={{ available: availableDates }}
            modifiersClassNames={{ available: 'font-semibold text-[#2563EB]' }}
            className="h-full w-full rounded-2xl border border-[#E0E2E6] p-3"
            classNames={{
              month: 'grid grid-cols-[auto_1fr_auto] items-center gap-y-4 w-full',
              month_grid: 'col-span-3 w-full h-full border-collapse space-y-1',
              weekdays: '',
              week: 'w-full ',
            }}
          />
        </div>

        {/* ── Select a time ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[#1E293B]">
            {activeSlots[0] ? formatDateLabel(activeSlots[0], learnerTimezone) : 'Select a date'}
          </h3>

          <div className="flex max-h-[360px] flex-col gap-2 overflow-y-auto pr-1">
            {activeKey && activeSlots.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#E0E2E6] p-4 text-center text-sm text-[#6B7280]">
                No times available on this day
              </p>
            )}
            {!activeKey && (
              <p className="rounded-xl border border-dashed border-[#E0E2E6] p-4 text-center text-sm text-[#6B7280]">
                No availability this month
              </p>
            )}
            {activeSlots.map((slot) => {
              const isTaken = !currentSlots.has(slot)
              if (isTaken) {
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled
                    className="flex w-full items-center justify-between rounded-full border border-[#E0E2E6] px-5 py-3 text-sm text-[#B0B0B0] line-through disabled:cursor-not-allowed"
                  >
                    {formatSlotTime(slot, learnerTimezone)}
                    <span className="text-xs no-underline">Just booked</span>
                  </button>
                )
              }
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isCreateHoldPending}
                  onClick={() => handlePick(slot)}
                  className="w-full rounded-full border border-[#2563EB] px-5 py-3 text-center text-sm font-medium text-[#2563EB] transition-colors hover:bg-[#2563EB] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {formatSlotTime(slot, learnerTimezone)}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {pickError && <p className="text-sm text-destructive">{pickError}</p>}
    </div>
  )
}

export default SlotSelectionGrid
