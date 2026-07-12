import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { format } from 'date-fns'
import type { AvailabilityException } from '../../types/dto'
import { useDeleteAvailabilityException } from '../hooks/useAvailabilityExceptions'
import ExceptionChip from './ExceptionChip'
import OverrideEntryForm from './OverrideEntryForm'

interface DateDetailSheetProps {
  date: Date | null
  exceptions: AvailabilityException[]
  timezone: string
  onConflict: (error: unknown) => boolean
  onClose: () => void
}

const DateDetailSheet = ({
  date,
  exceptions,
  timezone,
  onConflict,
  onClose,
}: DateDetailSheetProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const deleteException = useDeleteAvailabilityException()
  const dateStr = date ? format(date, 'yyyy-MM-dd') : null
  const dayExceptions = dateStr ? exceptions.filter((e) => e.date.slice(0, 10) === dateStr) : []

  return (
    <Sheet open={date !== null} onOpenChange={(next) => !next && onClose()}>
      <SheetContent side={isDesktop ? 'right' : 'bottom'} className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{date ? format(date, 'EEEE, MMMM d, yyyy') : ''}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-4">
          {dayExceptions.length > 0 && (
            <div className="flex flex-col gap-2">
              {dayExceptions.map((exception) => (
                <ExceptionChip
                  key={exception.id}
                  exception={exception}
                  isRemoving={deleteException.isPending}
                  onRemove={() =>
                    deleteException.mutate(exception.id, {
                      onError: (error) => {
                        if (!onConflict(error)) console.error(error)
                      },
                    })
                  }
                />
              ))}
            </div>
          )}

          {dateStr && (
            <div className="flex flex-col gap-3">
              <OverrideEntryForm
                type="BLOCKED"
                date={dateStr}
                timezone={timezone}
                onConflict={onConflict}
              />
              <OverrideEntryForm
                type="ADDED"
                date={dateStr}
                timezone={timezone}
                onConflict={onConflict}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default DateDetailSheet
