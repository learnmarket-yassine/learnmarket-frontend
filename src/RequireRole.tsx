import { useStore } from '@/store/store'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthUser } from './features/auth/store/types'

interface RequireRoleProps {
  role: AuthUser['role']
}

const RequireRole = ({ role }: RequireRoleProps) => {
  const user = useStore((state) => state.auth.user)
  const location = useLocation()

  if (user && user.role !== role) {
    return <Navigate to="/profile" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireRole
