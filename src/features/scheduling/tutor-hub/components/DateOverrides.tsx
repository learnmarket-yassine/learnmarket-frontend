import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { format, startOfDay } from 'date-fns'
import { useMemo, useState } from 'react'
import type { DayButtonProps } from 'react-day-picker'
import { useAvailabilityExceptions } from '../hooks/useAvailabilityExceptions'
import DateDetailSheet from './DateDetailSheet'
import QuickOverrideDialog from './QuickOverrideDialog'

export interface DateOverridesProps {
  timezone: string
  onConflict: (error: unknown) => boolean
}

const DateOverrides = ({ timezone, onConflict }: DateOverridesProps) => {
  const exceptionsQuery = useAvailabilityExceptions()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { blockedDates, addedDates } = useMemo(() => {
    const blocked = new Set<string>()
    const added = new Set<string>()
    for (const exception of exceptionsQuery.data ?? []) {
      const key = exception.date.slice(0, 10)
      ;(exception.type === 'BLOCKED' ? blocked : added).add(key)
    }
    return { blockedDates: blocked, addedDates: added }
  }, [exceptionsQuery.data])

  if (exceptionsQuery.isPending) {
    return <Skeleton className="h-80 w-full" />
  }

  if (exceptionsQuery.isError) {
    return <p className="py-4 text-sm text-destructive">Couldn&apos;t load date overrides.</p>
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-destructive" /> Blocked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" /> Added
          </span>
        </div>
        <QuickOverrideDialog timezone={timezone} onConflict={onConflict} />
      </div>

      <Calendar
        mode="single"
        selected={undefined}
        disabled={{ before: startOfDay(new Date()) }}
        onDayClick={(day, modifiers) => {
          if (modifiers.disabled) return
          setSelectedDate(day)
        }}
        components={{
          DayButton: ({
            day,
            modifiers: _modifiers,
            className,
            children,
            ...rest
          }: DayButtonProps) => {
            const key = format(day.date, 'yyyy-MM-dd')
            const hasBlocked = blockedDates.has(key)
            const hasAdded = addedDates.has(key)
            return (
              <button className={cn(className, 'relative')} {...rest}>
                {children}
                {(hasBlocked || hasAdded) && (
                  <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                    {hasBlocked && <span className="size-1 rounded-full bg-destructive" />}
                    {hasAdded && <span className="size-1 rounded-full bg-emerald-500" />}
                  </span>
                )}
              </button>
            )
          },
        }}
      />

      <DateDetailSheet
        date={selectedDate}
        exceptions={exceptionsQuery.data}
        timezone={timezone}
        onConflict={onConflict}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  )
}

export default DateOverrides
