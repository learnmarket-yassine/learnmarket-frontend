/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useStore } from '@/store/store'
import { axiosPrivate } from '@/lib/api/client'
import useRefreshToken from '@/features/auth/hooks/useRefreshToken'

const useAxiosPrivate = () => {
  const auth = useStore((state) => state.auth)
  const getNewAccessToken = useRefreshToken()
  const accessToken = auth?.authenticationResult?.AccessToken
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        let interceptedAccessToken = accessToken
        if (!interceptedAccessToken) {
          const refreshedTokens = await getNewAccessToken() // Await refresh
          interceptedAccessToken = refreshedTokens.AccessToken
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
          prevRequest.headers['Authorization'] = `Bearer ${refreshedTokens.AccessToken}`
          return axiosPrivate(prevRequest)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [])

  return axiosPrivate
}

export default useAxiosPrivate
