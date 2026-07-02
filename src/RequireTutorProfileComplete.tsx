import { useStore } from '@/store/store'
import { useLocation, Navigate, Outlet } from 'react-router-dom'

const RequireTutorProfileComplete = () => {
  const user = useStore((state) => state.auth.user)
  const location = useLocation()

  if (user?.role === 'TUTOR' && !user.isProfileCompleted) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireTutorProfileComplete
