import { useStore } from '@/store/store'
import TutorOnboardingPage from './TutorOnboardingPage'
import LearnerOnboardingPage from './LearnerOnboardingPage'

const OnboardingPage = () => {
  const user = useStore((state) => state.auth.user)

  if (!user) return null

  return user.role === 'LEARNER' ? <LearnerOnboardingPage /> : <TutorOnboardingPage />
}

export default OnboardingPage
