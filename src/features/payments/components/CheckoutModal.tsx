import { useState } from 'react'
import { X } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Dialog, DialogPortal, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { stripePromise } from '@/lib/stripe'

interface CheckoutModalProps {
  open: boolean
  clientSecret: string
  tutorName: string
  onClose: () => void
  onConfirmed: () => void
}

interface CheckoutFormProps {
  tutorName: string
  onClose: () => void
  onConfirmed: () => void
}

const CheckoutForm = ({ tutorName, onClose, onConfirmed }: CheckoutFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setIsSubmitting(true)
    setErrorMessage(null)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })

    setIsSubmitting(false)
    if (error) {
      setErrorMessage(error.message ?? 'Payment failed. Please try again.')
      return
    }
    onConfirmed()
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <DialogTitle className="text-xl font-bold text-[#1E293B]">
          Pay to hire {tutorName}
        </DialogTitle>
        <DialogPrimitive.Close
          className="rounded-full p-1 text-[#6B7280] hover:bg-[#F3F4F6] focus-visible:outline-none"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="size-5" />
        </DialogPrimitive.Close>
      </div>

      <PaymentElement />

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <div className="flex justify-end border-t border-[#E0E2E6] pt-4">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!stripe || !elements || isSubmitting}
          className="rounded-full bg-[#2563EB] px-8 py-5 font-medium text-white hover:bg-[#2563EB]/90"
        >
          {isSubmitting ? 'Processing...' : 'Pay & confirm'}
        </Button>
      </div>
    </>
  )
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
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          onClick={(e) => e.stopPropagation()}
          className="fixed left-[50%] top-[50%] z-50 grid max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto rounded-3xl border border-[#E0E2E6] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {open && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm tutorName={tutorName} onClose={onClose} onConfirmed={onConfirmed} />
            </Elements>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

export default CheckoutModal
