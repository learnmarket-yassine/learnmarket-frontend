import { useStore } from '@/store/store'
import TutorProfilePage from './TutorProfilePage'
import LearnerProfilePage from './LearnerProfilePage'

const MyProfilePage = () => {
  const user = useStore((state) => state.auth.user)

  if (!user) return null

  return user.role === 'LEARNER' ? <LearnerProfilePage /> : <TutorProfilePage />
}

export default MyProfilePage
