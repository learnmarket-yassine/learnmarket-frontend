import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation } from '@tanstack/react-query'
import { SparksPurchaseIntent } from '../store/types'
import ToastMessage from '@/components/layout/ToastMessage'

export default function useCreateSparksPurchaseIntent() {
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async (offerId: string) => {
      const response = await axiosPrivate.post<SparksPurchaseIntent>('/sparks/purchase-intent', {
        offerId,
      })
      return response.data
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to prepare your Sparks purchase. Please try again.',
      })
    },
  })
}
