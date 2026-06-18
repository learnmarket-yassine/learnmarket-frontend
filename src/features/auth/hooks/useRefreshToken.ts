import axios from '@/lib/api/client'
import { useStore } from '@/store/store'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const refreshTokenEndpoint = '/auth/refresh-token'

const useRefreshToken = () => {
  const { setAuthenticationResult } = useStore((state) => state.auth)
  const navigate = useNavigate()

  const { mutateAsync: getNewAccessToken } = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.get(refreshTokenEndpoint, {
          withCredentials: true, // Ensure cookies are sent with the request
        })
        setAuthenticationResult(response.data?.AuthenticationResult)
        return response.data?.AuthenticationResult
      } catch (error: unknown) {
        setAuthenticationResult(null)
        navigate('/login')
        throw error // Re-throw the error to ensure the calling function can handle it
      }
    },
    retry: false, // Disable retry on failure
  })

  return getNewAccessToken // This is now an async function that must be explicitly called
}

export default useRefreshToken
