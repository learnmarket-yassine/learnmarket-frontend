import { useStore } from '@/store/store'
import { Navigate, Outlet } from 'react-router-dom'

const RequireIncompleteTutorProfile = () => {
  const user = useStore((state) => state.auth.user)

  if (user && (user.role !== 'TUTOR' || user.isProfileCompleted)) {
    return <Navigate to="/profile" replace />
  }

  return <Outlet />
}

export default RequireIncompleteTutorProfile
