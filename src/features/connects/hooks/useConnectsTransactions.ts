import { useQuery } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ConnectsTransactionsResponse } from '../types'

const useConnectsTransactions = (page = 1) => {
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)

  return useQuery({
    queryKey: ['ConnectsTransactions', page],
    queryFn: async (): Promise<ConnectsTransactionsResponse> => {
      const response = await axiosPrivate.get('/connects/transactions', {
        params: { page, limit: 20 },
        headers: { Authorization: `Bearer ${authenticationResult?.token}` },
      })
      return response.data
    },
    enabled: !!authenticationResult?.token,
  })
}

export default useConnectsTransactions
