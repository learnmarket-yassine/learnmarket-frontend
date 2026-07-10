import { useStore } from '@/store/store'
import { useLocation, Navigate, Outlet } from 'react-router-dom'

const RequireProfileComplete = () => {
  const user = useStore((state) => state.auth.user)
  const location = useLocation()

  if (user && (user.role === 'TUTOR' || user.role === 'LEARNER') && !user.isProfileCompleted) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireProfileComplete
