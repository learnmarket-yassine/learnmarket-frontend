import { Loader2 } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogPortal, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useProposalAcceptedSocket } from '../hooks/useProposalAcceptedSocket'

interface CheckoutWaitingModalProps {
  open: boolean
  proposalId: string | null
  onAccepted: () => void
  onDismiss: () => void
}

// Payment confirmation (stripe.confirmPayment) resolving does NOT mean the
// proposal is accepted yet -- that only happens once the
// payment_intent.succeeded webhook lands and runs the accept transaction,
// which can trail the synchronous confirm call by a moment. This screen
// bridges that gap via the /payments socket namespace rather than polling
// (no polling precedent exists elsewhere in this codebase).
const CheckoutWaitingModal = ({
  open,
  proposalId,
  onAccepted,
  onDismiss,
}: CheckoutWaitingModalProps) => {
  useProposalAcceptedSocket(open ? proposalId : null, onAccepted)

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onDismiss()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          onClick={(e) => e.stopPropagation()}
          className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 rounded-3xl border border-[#E0E2E6] bg-white p-8 text-center shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <DialogTitle className="sr-only">Finalizing your booking</DialogTitle>
          <Loader2 className="mx-auto size-10 animate-spin text-[#2563EB]" aria-hidden="true" />
          <p className="text-lg font-semibold text-[#143681]">Finalizing your booking...</p>
          <p className="text-sm text-muted-foreground">
            Payment received -- confirming with the tutor now. This usually takes a few seconds.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mx-auto mt-2 rounded-full px-6"
            onClick={onDismiss}
          >
            Continue in background
          </Button>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

export default CheckoutWaitingModal
