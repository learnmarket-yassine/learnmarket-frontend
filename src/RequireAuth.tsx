import { useStore } from '@/store/store'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useGetUser from './features/auth/hooks/useGetUser'
import Loader from './components/ui/Loader/Loader'

const RequireAuth = () => {
  const auth = useStore((state) => state.auth.authenticationResult)
  const location = useLocation()
  const getUserQuery = useGetUser()

  if (!auth?.token) {
    return <Navigate to="login" state={{ from: location }} replace />
  }

  if (getUserQuery.isPending) {
    return <Loader className="flex h-full w-full items-center justify-center" />
  }

  if (getUserQuery.isError) {
    return <Navigate to="login" state={{ from: location }} replace />
  }

  return <Outlet />
}
export default RequireAuth
