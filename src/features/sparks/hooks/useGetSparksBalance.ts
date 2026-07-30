import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { SparksBalance } from '../store/types'

const getSparksBalance = async (api: AxiosInstance): Promise<SparksBalance> => {
  const response = await api.get('/sparks/balance')
  return response.data
}

export default function useGetSparksBalance() {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['sparks', 'balance'],
    queryFn: () => getSparksBalance(axiosPrivate),
  })
}
