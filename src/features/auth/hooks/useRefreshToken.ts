import axios from '@/lib/api/client'
import { useStore } from '@/store/store'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

let refreshPromise: Promise<{ token: string }> | null = null

const useRefreshToken = () => {
  const { setAuthenticationResult } = useStore((state) => state.auth)
  const navigate = useNavigate()

  const { mutateAsync: getNewAccessToken } = useMutation({
    mutationFn: () => {
      if (!refreshPromise) {
        refreshPromise = axios
          .post('/auth/refresh')
          .then((response) => {
            const token = response.data?.token
            setAuthenticationResult({ token })
            return { token }
          })
          .catch((error: unknown) => {
            setAuthenticationResult(null)
            navigate('/login')
            throw error // Re-throw the error to ensure the calling function can handle it
          })
          .finally(() => {
            refreshPromise = null
          })
      }
      return refreshPromise
    },
    retry: false, // Disable retry on failure
  })

  return getNewAccessToken
}

export default useRefreshToken
