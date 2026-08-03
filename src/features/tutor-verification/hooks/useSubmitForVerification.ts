import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import ToastMessage from '@/components/layout/ToastMessage'

function useSubmitForVerification() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.post('/tutor/profile/submit-verification')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Verification request submitted.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to submit your verification request. Please try again.',
      })
    },
  })
}

export default useSubmitForVerification
