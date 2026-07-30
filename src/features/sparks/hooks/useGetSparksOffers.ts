import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { SparksOffer } from '../store/types'

const getSparksOffers = async (api: AxiosInstance): Promise<SparksOffer[]> => {
  const response = await api.get('/sparks/offers')
  return response.data
}

export default function useGetSparksOffers() {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['sparks', 'offers'],
    queryFn: () => getSparksOffers(axiosPrivate),
  })
}
