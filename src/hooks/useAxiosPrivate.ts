import { useEffect } from 'react'
import { useStore } from '@/store/store'
import { axiosPrivate } from '@/lib/api/client'
import useRefreshToken from '@/features/auth/hooks/useRefreshToken'

const useAxiosPrivate = () => {
  const getNewAccessToken = useRefreshToken()
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        // Read the token live from the store instead of a value captured when this
        // effect first ran, so a token refreshed after mount is actually picked up.
        let interceptedAccessToken = useStore.getState().auth.authenticationResult?.token
        if (!interceptedAccessToken) {
          const refreshedTokens = await getNewAccessToken() // Await refresh
          interceptedAccessToken = refreshedTokens.token
        }
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${interceptedAccessToken}`
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (
          (error?.response?.status === 401 || error?.response?.status === 500) &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true
          const refreshedTokens = await getNewAccessToken() // Await refresh
          prevRequest.headers['Authorization'] = `Bearer ${refreshedTokens.token}`
          return axiosPrivate(prevRequest)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [getNewAccessToken])

  return axiosPrivate
}

export default useAxiosPrivate
