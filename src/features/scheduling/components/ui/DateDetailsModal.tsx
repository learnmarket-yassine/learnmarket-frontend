import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { useState } from 'react'
import type { AvailabilityException } from '../../types/dto'
import OverrideEntryForm from './OverrideEntryForm'

interface DateDetailModalProps {
  date: Date | null
  exceptions: AvailabilityException[]
  timezone: string
  onConflict: (error: unknown) => boolean
  onClose: () => void
  initialEditingId?: string | null
  initialStart?: number
}

const DateDetailsModal = ({
  date,
  exceptions,
  timezone,
  onConflict,
  onClose,
  initialEditingId = null,
  initialStart,
}: DateDetailModalProps) => {
  const [editingId, setEditingId] = useState<string | null>(initialEditingId)
  const dateStr = date ? format(date, 'yyyy-MM-dd') : null
  const dayExceptions = dateStr ? exceptions.filter((e) => e.date.slice(0, 10) === dateStr) : []
  const editingException = dayExceptions.find((e) => e.id === editingId) ?? null

  const [lastDateStr, setLastDateStr] = useState(dateStr)
  const [lastEditingSeed, setLastEditingSeed] = useState(initialEditingId)
  if (dateStr !== lastDateStr || initialEditingId !== lastEditingSeed) {
    setLastDateStr(dateStr)
    setLastEditingSeed(initialEditingId)
    setEditingId(initialEditingId)
  }

  return (
    <Dialog open={date !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="flex flex-col space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#143681]">
            {date ? format(date, 'EEEE, MMMM d, yyyy') : ''}
          </DialogTitle>
        </DialogHeader>

        {dateStr && (
          <OverrideEntryForm
            date={dateStr}
            timezone={timezone}
            exception={editingException}
            initialStart={editingException ? undefined : initialStart}
            onConflict={onConflict}
            onDone={() => {
              setEditingId(null)
              onClose()
            }}
            onSaved={() => {
              setEditingId(null)
              onClose()
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DateDetailsModal
