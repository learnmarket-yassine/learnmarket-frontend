import { useQuery } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Annonce } from '../types'

const useAnnonces = () => {
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)

  return useQuery({
    queryKey: ['Annonces'],
    queryFn: async (): Promise<Annonce[]> => {
      const response = await axiosPrivate.get('/annonces', {
        headers: { Authorization: `Bearer ${authenticationResult?.token}` },
      })
      return response.data
    },
    enabled: !!authenticationResult?.token,
  })
}

export default useAnnonces
