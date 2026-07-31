import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { TutorFeedbackEntry } from '../store/types'

const useGetTutorFeedback = (tutorId: string | undefined) => {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['tutors', tutorId, 'feedback'],
    queryFn: async (): Promise<TutorFeedbackEntry[]> => {
      const response = await axiosPrivate.get(`/tutors/${tutorId}/feedback`)
      return response.data
    },
    enabled: !!tutorId,
    staleTime: 5 * 60 * 1000,
  })
}

export default useGetTutorFeedback
