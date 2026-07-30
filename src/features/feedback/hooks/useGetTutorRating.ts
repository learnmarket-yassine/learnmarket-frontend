import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { TutorRatingSummary } from '../store/types'

const useGetTutorRating = (tutorId: string | undefined) => {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['tutors', tutorId, 'rating'],
    queryFn: async (): Promise<TutorRatingSummary> => {
      const response = await axiosPrivate.get(`/tutors/${tutorId}/rating`)
      return response.data
    },
    enabled: !!tutorId,
    staleTime: 5 * 60 * 1000,
  })
}

export default useGetTutorRating
