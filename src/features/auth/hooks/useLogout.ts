import axios from '@/lib/api/client'
import { useStore } from '@/store/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const useLogout = () => {
  const setUser = useStore((state) => state.auth.setUser)
  const setAuthenticationResult = useStore((state) => state.auth.setAuthenticationResult)
  const setFormStep = useStore((state) => state.onBoarding.setFormStep)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        '/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${useStore.getState().auth.authenticationResult?.token}`,
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      setUser(null)
      setAuthenticationResult(null)
      setFormStep(1)
      queryClient.clear()
      navigate('/')
    },
  })
}

export default useLogout
