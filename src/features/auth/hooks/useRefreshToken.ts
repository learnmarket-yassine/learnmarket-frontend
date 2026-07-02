import axios from '@/lib/api/client'
import { useStore } from '@/store/store'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const useRefreshToken = () => {
  const { setAuthenticationResult } = useStore((state) => state.auth)
  const navigate = useNavigate()

  const { mutateAsync: getNewAccessToken } = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.post('/auth/refresh')
        const token = response.data?.token
        setAuthenticationResult({ token })
        return { token }
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
