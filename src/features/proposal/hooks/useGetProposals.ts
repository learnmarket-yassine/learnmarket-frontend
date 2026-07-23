import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

export default function useGetProposals() {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['proposals'],
    queryFn: async (): Promise<unknown[]> => {
      const response = await axiosPrivate.get('/proposals')
      return response.data
    },
  })
}
