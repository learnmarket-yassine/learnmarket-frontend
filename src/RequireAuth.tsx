import { useStore } from '@/store/store'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useGetUser from './features/auth/hooks/useGetUser'

const RequireAuth = () => {
  const auth = useStore((state) => state.auth.authenticationResult)
  const location = useLocation()
  const getUserQuery = useGetUser()

  if (!auth?.token) {
    return <Navigate to="login" state={{ from: location }} replace />
  }
  if (getUserQuery.isPending || getUserQuery.isFetching) {
    return <h1>loading...</h1>
  }

  if (getUserQuery.isError) {
    return <Navigate to="login" state={{ from: location }} replace />
  }

  return <Outlet />
}
export default RequireAuth
