import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CalendarIcon, Clock } from 'lucide-react'
import type { SlotHold } from '../../types/dto'
import { formatDateLabel, formatSlotTime } from '../../utils/time'
import HoldCountdownBadge from './HoldCountdownBadge'

type HoldSlotModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  hold: SlotHold
  timezone: string
  isConfirming: boolean
  onConfirm: () => void
  onChooseDifferentTime: () => void
}

const HoldSlotModal = ({
  open,
  onOpenChange,
  hold,
  timezone,
  isConfirming,
  onConfirm,
  onChooseDifferentTime,
}: HoldSlotModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex w-[500px] flex-col space-y-6"
        style={{
          boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-2xl font-bold text-[#143681]">
              Confirm your session
            </DialogTitle>
            <HoldCountdownBadge expiresAt={hold.expiresAt} />
          </div>
        </DialogHeader>

        <div className="flex flex-col items-start gap-5">
          <div className="flex w-full flex-col gap-2 rounded-2xl border border-[#E0E2E6] bg-[#F9FAFB] p-5">
            <div className="flex items-center gap-2 text-base font-medium text-[#1E293B]">
              <CalendarIcon className="size-5 text-[#2563EB]" />
              {formatDateLabel(hold.startTime, timezone)}
            </div>
            <div className="flex items-center gap-2 text-base text-[#565A60]">
              <Clock className="size-5 text-[#2563EB]" />
              {formatSlotTime(hold.startTime, timezone)} – {formatSlotTime(hold.endTime, timezone)}
            </div>
          </div>

          <div className="flex w-full justify-end gap-2">
            <Button
              type="button"
              className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
              onClick={onChooseDifferentTime}
              disabled={isConfirming}
            >
              Choose a different time
            </Button>

            <Button
              type="button"
              className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
              onClick={onConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? 'Confirming…' : 'Confirm booking'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HoldSlotModal
