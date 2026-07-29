import { Elements } from '@stripe/react-stripe-js'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { stripePromise } from '@/lib/stripe'
import CheckoutForm from './CheckoutForm'

interface CheckoutModalProps {
  open: boolean
  clientSecret: string
  tutorName: string
  onClose: () => void
  onConfirmed: () => void
}

const CheckoutModal = ({
  open,
  clientSecret,
  tutorName,
  onClose,
  onConfirmed,
}: CheckoutModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="fixed left-[50%] top-[50%] z-50 grid max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto rounded-3xl border border-[#E0E2E6] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
      >
        {open && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm tutorName={tutorName} onClose={onClose} onConfirmed={onConfirmed} />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutModal
