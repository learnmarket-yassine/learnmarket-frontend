import { useQuery } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Proposal } from '../types'

const useMyProposals = () => {
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)

  return useQuery({
    queryKey: ['MyProposals'],
    queryFn: async (): Promise<Proposal[]> => {
      const response = await axiosPrivate.get('/proposals/me', {
        headers: { Authorization: `Bearer ${authenticationResult?.token}` },
      })
      return response.data
    },
    enabled: !!authenticationResult?.token,
  })
}

export default useMyProposals
