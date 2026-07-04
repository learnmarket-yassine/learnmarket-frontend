import ImportDataStep from '@/features/onboarding/components/layout/FormSteps/ImportDataStep'
import TutorOnboardingLayout from '@/features/onboarding/components/layout/TutorOnboardingLayout'
import OnboardingProgress from '@/features/onboarding/components/ui/OnBoardingProgress'
import { useStore } from '@/store/store'
import { Navigate } from 'react-router-dom'

const TutorOnboardingPage = () => {
  const user = useStore((state) => state.auth.user)
  const steps = [
    {
      stepNumber: 1,
      component: <ImportDataStep />,
      show: true,
      name: 'import data',
    },
  ]

  const currentStepComponent = steps.find((step) => step.stepNumber === 1)?.component || null

  if (!user) return null

  const isNotTutor = user.role !== 'TUTOR'
  const isCompleted = user.isProfileCompleted

  if (isNotTutor || isCompleted) {
    return <Navigate to="/profile" replace />
  }

  return (
    <TutorOnboardingLayout>
      <div className="flex flex-1 flex-col">
        <OnboardingProgress currentStep={1} totalSteps={10} />
        <div className="flex flex-1 items-center">{currentStepComponent}</div>
      </div>
    </TutorOnboardingLayout>
  )
}
export default TutorOnboardingPage
