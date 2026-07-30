import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { PublicTutorProfile } from '../store/types'

const useGetPublicTutorProfile = (tutorId: string | undefined) => {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['tutors', tutorId, 'profile'],
    queryFn: async (): Promise<PublicTutorProfile> => {
      const response = await axiosPrivate.get(`/tutors/${tutorId}`)
      return response.data
    },
    enabled: !!tutorId,
  })
}

export default useGetPublicTutorProfile
