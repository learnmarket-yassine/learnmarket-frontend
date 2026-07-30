import { useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

export default function useConnectPayoutAccount() {
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.post<{ url: string }>('/payments/connect/onboarding-link')
      return response.data
    },
    onSuccess: (data) => {
      window.location.href = data.url
    },
  })
}
