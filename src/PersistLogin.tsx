import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useRefreshToken from './features/auth/hooks/useRefreshToken'

const PersistLogin = () => {
  const getNewAccessToken = useRefreshToken()
  const [isLoading, setIsLoading] = useState(true) // State to track loading

  useEffect(() => {
    const refreshToken = async () => {
      try {
        await getNewAccessToken()
      } finally {
        setIsLoading(false)
      }
    }

    refreshToken()
  }, [getNewAccessToken])
  return (
    <>
      {isLoading ? <div className="flex items-center justify-center">loading...</div> : <Outlet />}
    </>
  )
}

export default PersistLogin
