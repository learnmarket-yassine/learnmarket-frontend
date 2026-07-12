import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { format, startOfDay } from 'date-fns'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { useCreateAvailabilityException } from '../hooks/useAvailabilityExceptions'

interface QuickOverrideDialogProps {
  timezone: string
  onConflict: (error: unknown) => boolean
}

function enumerateDates(range: DateRange | undefined): string[] {
  if (!range?.from) return []
  const to = range.to ?? range.from
  const dates: string[] = []
  for (let cursor = new Date(range.from); cursor <= to; cursor.setDate(cursor.getDate() + 1)) {
    dates.push(format(cursor, 'yyyy-MM-dd'))
  }
  return dates
}

const QuickOverrideDialog = ({ timezone, onConflict }: QuickOverrideDialogProps) => {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [reason, setReason] = useState('')
  const createException = useCreateAvailabilityException()

  const dates = enumerateDates(range)

  const handleApply = async () => {
    try {
      for (const date of dates) {
        await createException.mutateAsync({
          date,
          type: 'BLOCKED',
          timezone,
          reason: reason || undefined,
        })
      }
      setOpen(false)
      setRange(undefined)
      setReason('')
    } catch (error) {
      setOpen(false)
      if (!onConflict(error)) console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Quick Override
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block multiple days</DialogTitle>
        </DialogHeader>
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          disabled={{ before: startOfDay(new Date()) }}
        />
        <Input
          placeholder="Reason (optional)"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <DialogFooter>
          <Button
            type="button"
            onClick={handleApply}
            disabled={dates.length === 0 || createException.isPending}
          >
            {createException.isPending ? 'Blocking…' : `Block ${dates.length || ''} day(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default QuickOverrideDialog
