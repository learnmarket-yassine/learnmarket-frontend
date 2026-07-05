import EducationStep from '@/features/onboarding/components/layout/FormSteps/EducationStep'
import ExperienceStep from '@/features/onboarding/components/layout/FormSteps/ExperienceStep'
import HeadlineStep from '@/features/onboarding/components/layout/FormSteps/HeadlineStep'
import ImportDataStep from '@/features/onboarding/components/layout/FormSteps/ImportDataStep'
import LanguagesStep from '@/features/onboarding/components/layout/FormSteps/LanguagesStep'
import SkillsStep from '@/features/onboarding/components/layout/FormSteps/SkillsStep'
import TutorOnboardingLayout from '@/features/onboarding/components/layout/TutorOnboardingLayout'
import OnboardingProgress from '@/features/onboarding/components/ui/OnBoardingProgress'
import StepperButtons from '@/features/onboarding/components/ui/StepperButtons'
import { useStore } from '@/store/store'
import { Navigate } from 'react-router-dom'
import OverviewStep from '@/features/onboarding/components/layout/FormSteps/OverviewStep'
import HourlyRateStep from '@/features/onboarding/components/layout/FormSteps/HourlyRateStep'
import UserInfoStep from '@/features/onboarding/components/layout/FormSteps/UserInfoStep'

const TutorOnboardingPage = () => {
  const user = useStore((state) => state.auth.user)
  const formStep = useStore((state) => state.onBoarding.formStep)

  const handleSaveCurrentStep = async () => {
    switch (formStep) {
      case 1:
        console.log('ahla')
        break
      default:
        break
    }
  }
  const steps = [
    {
      stepNumber: 1,
      component: <ImportDataStep />,
      show: true,
      name: 'import your data',
      canSkip: false,
    },
    {
      stepNumber: 2,
      component: <SkillsStep />,
      show: true,
      name: 'add your skills',
      canSkip: false,
    },
    {
      stepNumber: 3,
      component: <HeadlineStep />,
      show: true,
      name: 'add your title',
      canSkip: false,
    },
    {
      stepNumber: 4,
      component: <ExperienceStep />,
      show: true,
      name: 'add your experience',
      canSkip: true,
    },
    {
      stepNumber: 5,
      component: <EducationStep />,
      show: true,
      name: 'add your education',
    },
    {
      stepNumber: 6,
      component: <LanguagesStep />,
      show: true,
      name: 'add your languages',
      canSkip: true,
    },
    {
      stepNumber: 7,
      component: <OverviewStep />,
      show: true,
      name: 'write an overview',
    },
    {
      stepNumber: 8,
      component: <HourlyRateStep />,
      show: true,
      name: 'set your rate',
    },
    {
      stepNumber: 9,
      component: <UserInfoStep />,
      show: true,
      name: 'add your photo and location',
    },
  ]
  // Filter steps based on show conditions
  const visibleSteps = steps.filter((step) => step.show)

  const currentStepComponent =
    visibleSteps.find((step) => step.stepNumber === formStep)?.component || null

  if (!user) return null

  const isNotTutor = user.role !== 'TUTOR'
  // const isCompleted = user.isProfileCompleted

  if (isNotTutor) {
    return <Navigate to="/profile" replace />
  }

  return (
    <TutorOnboardingLayout>
      <form
        className="flex flex-grow flex-col space-y-12"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <OnboardingProgress currentStep={formStep} totalSteps={visibleSteps.length} />
        <div className="flex flex-1">{currentStepComponent}</div>
        <StepperButtons onNextStep={handleSaveCurrentStep} steps={visibleSteps} />
      </form>
    </TutorOnboardingLayout>
  )
}
export default TutorOnboardingPage
