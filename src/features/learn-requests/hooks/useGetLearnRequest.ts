import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { LearnRequest } from '../store/types'

const useGetLearnRequest = (id: string | undefined) => {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['learnRequest', id],
    queryFn: async (): Promise<LearnRequest> => {
      const response = await axiosPrivate.get(`/learn-requests/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export default useGetLearnRequest
