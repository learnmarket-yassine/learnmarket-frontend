import { useCallback, useEffect, useRef, useState } from 'react'
import LearnerAvailabilityStep from '@/features/onboarding/components/layout/FormSteps/LearnerAvailabilityStep'
import EducationStep from '@/features/onboarding/components/layout/FormSteps/EducationStep'
import LearnerInterestsStep from '@/features/onboarding/components/layout/FormSteps/LearnerInterestsStep'
import LanguagesStep from '@/features/onboarding/components/layout/FormSteps/LanguagesStep'
import HeadlineStep from '@/features/onboarding/components/layout/FormSteps/HeadlineStep'
import OverviewStep from '@/features/onboarding/components/layout/FormSteps/OverviewStep'
import UserInfoStep from '@/features/onboarding/components/layout/FormSteps/UserInfoStep'
import TutorOnboardingLayout from '@/features/onboarding/components/layout/TutorOnboardingLayout'
import OnboardingProgress from '@/features/onboarding/components/ui/OnBoardingProgress'
import StepperButtons, { StepHandle } from '@/features/onboarding/components/ui/StepperButtons'
import { useStore } from '@/store/store'
import { Navigate, useNavigate } from 'react-router-dom'

// Steps gated behind their own form validation before "Next" is enabled
const VALIDATED_STEPS = new Set([1, 2, 3, 5, 6, 7])

const LearnerOnboardingPage = () => {
  const user = useStore((state) => state.auth.user)
  const formStep = useStore((state) => state.onBoarding.formStep)
  const setFormStep = useStore((state) => state.onBoarding.setFormStep)
  const navigate = useNavigate()

  const interestsRef = useRef<StepHandle>(null)
  const availabilityRef = useRef<StepHandle>(null)
  const headlineRef = useRef<StepHandle>(null)
  const languagesRef = useRef<StepHandle>(null)
  const overviewRef = useRef<StepHandle>(null)
  const userInfoRef = useRef<StepHandle>(null)

  const [stepValidity, setStepValidity] = useState<Record<number, boolean>>({})
  const hasSyncedInitialStep = useRef(false)

  useEffect(() => {
    if (hasSyncedInitialStep.current) return
    if (user?.onboardingStep) {
      setFormStep(user.onboardingStep)
      hasSyncedInitialStep.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.onboardingStep])

  const setStepValid = useCallback((step: number, isValid: boolean) => {
    setStepValidity((prev) => (prev[step] === isValid ? prev : { ...prev, [step]: isValid }))
  }, [])

  const educationCount = user?.education.length ?? 0

  const isCurrentStepValid =
    formStep === 4
      ? educationCount > 0
      : VALIDATED_STEPS.has(formStep)
        ? !!stepValidity[formStep]
        : true

  const handleSaveCurrentStep = async (): Promise<boolean> => {
    switch (formStep) {
      case 1:
        return (await interestsRef.current?.submit()) ?? true
      case 2:
        return (await availabilityRef.current?.submit()) ?? true
      case 3:
        return (await headlineRef.current?.submit()) ?? true
      case 5:
        return (await languagesRef.current?.submit()) ?? true
      case 6:
        return (await overviewRef.current?.submit()) ?? true
      case 7:
        return (await userInfoRef.current?.submit()) ?? true
      default:
        return true
    }
  }

  const steps = [
    {
      stepNumber: 1,
      component: (
        <LearnerInterestsStep ref={interestsRef} onValidityChange={(v) => setStepValid(1, v)} />
      ),
      show: true,
      name: '',
      canSkip: false,
    },
    {
      stepNumber: 2,
      component: (
        <LearnerAvailabilityStep
          ref={availabilityRef}
          onValidityChange={(v) => setStepValid(2, v)}
        />
      ),
      show: true,
      name: 'set your availability',
      canSkip: false,
    },
    {
      stepNumber: 3,
      component: <HeadlineStep ref={headlineRef} onValidityChange={(v) => setStepValid(3, v)} />,
      show: true,
      name: 'add your title',
      canSkip: false,
    },
    {
      stepNumber: 4,
      component: (
        <EducationStep
          title="Tutors like to know what you know - add your education here."
          description="You don't have to have a degree. Adding any relevant education helps your tutors get to know you."
        />
      ),
      show: true,

      name: 'add your education',
      canSkip: false,
    },
    {
      stepNumber: 5,
      component: (
        <LanguagesStep
          ref={languagesRef}
          onValidityChange={(v) => setStepValid(5, v)}
          description="Yora is global, so tutors are often interested to know what languages you speak. English is a must, but do you speak any other languages?"
        />
      ),
      show: true,

      name: 'add your languages',
      canSkip: false,
    },
    {
      stepNumber: 6,
      component: <OverviewStep ref={overviewRef} onValidityChange={(v) => setStepValid(6, v)} />,
      show: true,

      name: 'write a bio',
      canSkip: false,
    },
    {
      stepNumber: 7,
      component: <UserInfoStep ref={userInfoRef} onValidityChange={(v) => setStepValid(7, v)} />,
      show: true,
      name: 'add your photo and location',
      canSkip: false,
    },
  ]
  // Filter steps based on show conditions
  const visibleSteps = steps.filter((step) => step.show)

  const currentStepComponent =
    visibleSteps.find((step) => step.stepNumber === formStep)?.component || null

  if (!user) return null

  const isNotLearner = user.role !== 'LEARNER'
  const isCompleted = user.isProfileCompleted

  if (isNotLearner || isCompleted) {
    return <Navigate to="/profile" replace />
  }

  return (
    <TutorOnboardingLayout>
      <form
        className="flex flex-grow flex-col space-y-3"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className="flex flex-1 flex-col space-y-6">
          <OnboardingProgress currentStep={formStep} totalSteps={visibleSteps.length} />
          <div className="flex flex-1">{currentStepComponent}</div>
        </div>
        <StepperButtons
          onNextStep={handleSaveCurrentStep}
          onComplete={() => navigate('/profile', { replace: true })}
          isNextDisabled={!isCurrentStepValid}
          steps={visibleSteps}
        />
      </form>
    </TutorOnboardingLayout>
  )
}
export default LearnerOnboardingPage
