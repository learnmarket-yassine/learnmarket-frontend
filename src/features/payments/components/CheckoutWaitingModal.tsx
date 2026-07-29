import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useProposalAcceptedSocket } from '../hooks/useProposalAcceptedSocket'
import CheckoutWaitingImage from '@/assets/CheckoutWaitingImage'

interface CheckoutWaitingModalProps {
  open: boolean
  proposalId: string | null
  onAccepted: () => void
  onDismiss: () => void
}

const CheckoutWaitingModal = ({
  open,
  proposalId,
  onAccepted,
  onDismiss,
}: CheckoutWaitingModalProps) => {
  useProposalAcceptedSocket(open ? proposalId : null, onAccepted)

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onDismiss()}>
      <DialogContent
        className="flex max-w-[400px] flex-wrap justify-center py-[2rem] sm:max-w-[335px] lg:max-h-[650px] lg:max-w-[450px]"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            <CheckoutWaitingImage />
          </DialogTitle>
          <DialogDescription className="flex flex-col flex-wrap justify-center text-[#2C2C2C]">
            <div className="mt-2 text-center text-3xl font-semibold">Finalizing your booking</div>
            <div className={`grid gap-4 py-4 text-center`}>
              Payment received -- confirming with the tutor now. This usually takes a few seconds.
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutWaitingModal
