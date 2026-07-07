import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/store'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Annonce, CreateAnnonceInput } from '../types'

const useCreateAnnonce = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const authenticationResult = useStore((state) => state.auth.authenticationResult)

  return useMutation({
    mutationFn: async (payload: CreateAnnonceInput): Promise<Annonce> => {
      const response = await axiosPrivate.post('/annonces', payload, {
        headers: { Authorization: `Bearer ${authenticationResult?.token}` },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Annonces'] })
    },
  })
}

export default useCreateAnnonce
