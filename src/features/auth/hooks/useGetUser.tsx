import { useStore } from '@/store/store'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useEffect } from 'react'
import { AuthUser } from '../store/types'
import { flattenSkills } from '@/features/myProfile/utils/normalizeSkills'
import { flattenSpecialties } from '@/features/myProfile/utils/normalizeSpecialties'

const useGetUser = () => {
  const setUser = useStore((state) => state.auth.setUser)
  const auth = useStore((state) => state.auth)
  const axiosPrivate = useAxiosPrivate()
  const getUserQuery = useQuery({
    queryKey: ['UserInfo'],
    queryFn: async (): Promise<AuthUser> => {
      const response = await axiosPrivate.get('/users/me')
      const data = response.data
      let result = data

      if (data.tutorProfile) {
        result = {
          ...result,
          tutorProfile: {
            ...data.tutorProfile,
            skills: flattenSkills(data.tutorProfile.skills),
            specialties: flattenSpecialties(data.tutorProfile.specialties),
            portfolio: (data.tutorProfile.portfolio ?? []).map(
              (item: (typeof data.tutorProfile.portfolio)[number]) => ({
                ...item,
                skills: flattenSkills(item.skills),
              })
            ),
          },
        }
      }

      if (data.learnerProfile) {
        result = {
          ...result,
          learnerProfile: {
            ...data.learnerProfile,
            interests: flattenSpecialties(data.learnerProfile.interests),
          },
        }
      }

      return result
    },
    enabled: !!auth?.authenticationResult?.token,
    refetchOnMount: true,
    retry: false,
    refetchOnWindowFocus: false,
  })
  useEffect(() => {
    if (getUserQuery.data) {
      setUser(getUserQuery.data)
    }
  }, [getUserQuery.data, setUser])
  return getUserQuery
}

export default useGetUser
