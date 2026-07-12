import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useState } from 'react'
import TimeInput from '../../components/TimeInput'
import type { ExceptionType } from '../../types/enums'
import { useCreateAvailabilityException } from '../hooks/useAvailabilityExceptions'

interface OverrideEntryFormProps {
  type: ExceptionType
  date: string
  timezone: string
  onConflict: (error: unknown) => boolean
}

const LABELS: Record<ExceptionType, { switchLabel: string; submitLabel: string }> = {
  BLOCKED: { switchLabel: 'Block time on this date', submitLabel: 'Add block' },
  ADDED: { switchLabel: 'Add extra availability', submitLabel: 'Add availability' },
}

const OverrideEntryForm = ({ type, date, timezone, onConflict }: OverrideEntryFormProps) => {
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<'full' | 'custom'>('full')
  const [start, setStart] = useState(9 * 60)
  const [end, setEnd] = useState(17 * 60)
  const [reason, setReason] = useState('')

  const createException = useCreateAvailabilityException()
  const labels = LABELS[type]

  const handleSubmit = async () => {
    try {
      await createException.mutateAsync({
        date,
        type,
        timezone,
        reason: reason || undefined,
        ...(mode === 'custom' ? { startTime: start, endTime: end } : {}),
      })
      setEnabled(false)
      setReason('')
      setMode('full')
    } catch (error) {
      if (!onConflict(error)) console.error(error)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
      <div className="flex items-center gap-3">
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        <span className="text-sm font-medium">{labels.switchLabel}</span>
      </div>

      {enabled && (
        <div className="flex flex-col gap-3 pl-11">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => value && setMode(value as 'full' | 'custom')}
          >
            <ToggleGroupItem value="full">Full Day</ToggleGroupItem>
            <ToggleGroupItem value="custom">Custom Time</ToggleGroupItem>
          </ToggleGroup>

          {mode === 'custom' && (
            <div className="flex items-center gap-2">
              <TimeInput value={start} onChange={setStart} />
              <span className="text-muted-foreground">–</span>
              <TimeInput value={end} onChange={setEnd} />
            </div>
          )}

          <Input
            placeholder="Reason (optional)"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />

          <Button
            type="button"
            size="sm"
            className="self-start"
            onClick={handleSubmit}
            disabled={createException.isPending || (mode === 'custom' && end <= start)}
          >
            {createException.isPending ? 'Adding…' : labels.submitLabel}
          </Button>
        </div>
      )}
    </div>
  )
}

export default OverrideEntryForm
