import { useQuery } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ConnectsBalance } from '../types'

const useConnectsBalance = () => {
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)

  return useQuery({
    queryKey: ['ConnectsBalance'],
    queryFn: async (): Promise<ConnectsBalance> => {
      const response = await axiosPrivate.get('/connects/balance', {
        headers: { Authorization: `Bearer ${authenticationResult?.token}` },
      })
      return response.data
    },
    enabled: !!authenticationResult?.token,
  })
}

export default useConnectsBalance
