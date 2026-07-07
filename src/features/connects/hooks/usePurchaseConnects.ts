import { useMutation } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

const usePurchaseConnects = () => {
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)

  return useMutation({
    mutationFn: async (packageId: string): Promise<{ url: string | null }> => {
      const response = await axiosPrivate.post(
        '/connects/purchase',
        { packageId },
        { headers: { Authorization: `Bearer ${authenticationResult?.token}` } }
      )
      return response.data
    },
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url
    },
  })
}

export default usePurchaseConnects
