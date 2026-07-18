import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { LearnRequestStats } from '../store/types'

const useGetLearnRequestStats = () => {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['learnRequestStats'],
    queryFn: async (): Promise<LearnRequestStats> => {
      const response = await axiosPrivate.get('/users/me/learn-request-stats')
      return response.data
    },
  })
}

export default useGetLearnRequestStats
