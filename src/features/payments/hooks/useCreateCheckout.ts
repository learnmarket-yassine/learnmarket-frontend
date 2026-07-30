import { useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

export interface CheckoutIntent {
  clientSecret: string | null
  paymentIntentId: string
  amount: number
  currency: string
}

// Replaces the old direct `/proposals/:id/accept` call -- hiring a tutor now
// goes through Stripe first. Acceptance itself only happens once the
// payment_intent.succeeded webhook fires; this just creates the
// PaymentIntent to confirm client-side.
export default function useCreateCheckout() {
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async (proposalId: string) => {
      const response = await axiosPrivate.post<CheckoutIntent>(`/proposals/${proposalId}/checkout`)
      return response.data
    },
  })
}
