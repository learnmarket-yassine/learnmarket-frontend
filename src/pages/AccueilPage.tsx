import { useStore } from '@/store/store'
import LearnerAccueilPage from './LearnerAccueilPage'
import TutorAccueilPage from './TutorAccueilPage'

const AccueilPage = () => {
  const user = useStore((state) => state.auth.user)

  if (!user) return null

  return user.role === 'LEARNER' ? <LearnerAccueilPage /> : <TutorAccueilPage />
}

export default AccueilPage
