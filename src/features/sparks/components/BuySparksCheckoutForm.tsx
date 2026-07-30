import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DialogTitle } from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { X } from 'lucide-react'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { SparksBalance } from '../store/types'

interface BuySparksCheckoutFormProps {
  offerName: string
  onClose: () => void
  onConfirmed: () => void
}

async function pollForBalanceIncrease(queryClient: QueryClient, previousBalance: number) {
  for (let attempt = 0; attempt < 6; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 700))
    await queryClient.refetchQueries({ queryKey: ['sparks', 'balance'] })
    const current = queryClient.getQueryData<SparksBalance>(['sparks', 'balance'])
    if (current && current.sparksBalance > previousBalance) return
  }
}

const BuySparksCheckoutForm = ({ offerName, onClose, onConfirmed }: BuySparksCheckoutFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setIsSubmitting(true)
    setErrorMessage(null)
    const previousBalance =
      queryClient.getQueryData<SparksBalance>(['sparks', 'balance'])?.sparksBalance ?? 0

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

    setIsConfirming(true)
    await pollForBalanceIncrease(queryClient, previousBalance)
    queryClient.invalidateQueries({ queryKey: ['sparks', 'history'] })
    setIsConfirming(false)
    onConfirmed()
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <DialogTitle className="text-xl font-bold text-[#1E293B]">Buy {offerName}</DialogTitle>
        <DialogClose
          className="rounded-full p-1 text-[#6B7280] hover:bg-[#F3F4F6] focus-visible:outline-none"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="size-5" />
        </DialogClose>
      </div>
      <PaymentElement />
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      <div className="flex justify-end border-t border-[#E0E2E6] pt-4">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!stripe || !elements || isSubmitting || isConfirming}
          className="rounded-full bg-[#2563EB] px-8 py-5 font-medium text-white hover:bg-[#2563EB]/90"
        >
          {isSubmitting ? 'Processing...' : isConfirming ? 'Confirming...' : 'Pay & confirm'}
        </Button>
      </div>
    </>
  )
}

export default BuySparksCheckoutForm
