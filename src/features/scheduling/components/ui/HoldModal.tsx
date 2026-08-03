import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { SlotHold } from '../../types/dto'
import { formatDateLabel, formatSlotTime } from '../../utils/time'
import HoldCountdownBadge from './HoldCountdownBadge'
import SaveImage from '@/assets/SaveImage'

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
      <DialogContent className="flex max-w-[300px] flex-col items-center justify-center gap-9 py-[2rem] sm:max-w-[335px] lg:max-h-[650px] lg:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center justify-end">
            <HoldCountdownBadge expiresAt={hold.expiresAt} />
          </div>
          <DialogTitle className="flex justify-center">
            <SaveImage />
          </DialogTitle>
          <DialogDescription className="flex flex-col items-center text-[#2C2C2C]">
            <span className="mb-4 text-center text-3xl font-[600]">Confirm your session time</span>
            <div className="text-center">
              You have reserved this session on{' '}
              <span className="font-semibold text-slate-800">
                {formatDateLabel(hold.startTime, timezone)}
              </span>{' '}
              from{' '}
              <span className="font-semibold text-slate-800">
                {formatSlotTime(hold.startTime, timezone)}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-800">
                {formatSlotTime(hold.endTime, timezone)}
              </span>
              . Are you sure you want to confirm this booking?
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3">
          <Button
            type="button"
            className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
            onClick={onChooseDifferentTime}
            disabled={isConfirming}
          >
            Choose another time
          </Button>

          <Button
            type="button"
            className="h-full whitespace-nowrap rounded-full bg-blue-800 px-6 py-3 font-medium text-white hover:bg-blue-900"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? 'Confirming...' : 'Confirm booking'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HoldSlotModal
