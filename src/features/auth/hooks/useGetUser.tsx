import { useStore } from '@/store/store'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useEffect } from 'react'

const useGetUser = () => {
  const setUser = useStore((state) => state.auth.setUser)
  const auth = useStore((state) => state.auth)
  const axiosPrivate = useAxiosPrivate()
  const getUserQuery = useQuery({
    queryKey: ['UserInfo'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/users/me')
      return response.data
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
  }, [getUserQuery.data])
  return getUserQuery
}

export default useGetUser
