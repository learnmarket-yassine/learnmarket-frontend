import { useCallback, useEffect, useRef, useState } from 'react'
import EducationStep from '@/features/onboarding/components/layout/FormSteps/EducationStep'
import ExperienceStep from '@/features/onboarding/components/layout/FormSteps/ExperienceStep'
import HeadlineStep from '@/features/onboarding/components/layout/FormSteps/HeadlineStep'
import ImportDataStep from '@/features/onboarding/components/layout/FormSteps/ImportDataStep'
import LanguagesStep from '@/features/onboarding/components/layout/FormSteps/LanguagesStep'
import SkillsStep from '@/features/onboarding/components/layout/FormSteps/SkillsStep'
import SpecialtiesStep from '@/features/onboarding/components/layout/FormSteps/SpecialtiesStep'
import TutorOnboardingLayout from '@/features/onboarding/components/layout/TutorOnboardingLayout'
import OnboardingProgress from '@/features/onboarding/components/ui/OnBoardingProgress'
import StepperButtons, { StepHandle } from '@/features/onboarding/components/ui/StepperButtons'
import { useStore } from '@/store/store'
import { Navigate, useNavigate } from 'react-router-dom'
import OverviewStep from '@/features/onboarding/components/layout/FormSteps/OverviewStep'
import HourlyRateStep from '@/features/onboarding/components/layout/FormSteps/HourlyRateStep'
import UserInfoStep from '@/features/onboarding/components/layout/FormSteps/UserInfoStep'

// Steps gated behind their own form validation before "Next" is enabled
const VALIDATED_STEPS = new Set([2, 3, 4, 6, 7, 8, 9, 10])

const TutorOnboardingPage = () => {
  const user = useStore((state) => state.auth.user)
  const formStep = useStore((state) => state.onBoarding.formStep)
  const setFormStep = useStore((state) => state.onBoarding.setFormStep)
  const navigate = useNavigate()

  const specialtiesRef = useRef<StepHandle>(null)
  const skillsRef = useRef<StepHandle>(null)
  const headlineRef = useRef<StepHandle>(null)
  const languagesRef = useRef<StepHandle>(null)
  const overviewRef = useRef<StepHandle>(null)
  const hourlyRateRef = useRef<StepHandle>(null)
  const userInfoRef = useRef<StepHandle>(null)

  const [stepValidity, setStepValidity] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (user?.onboardingStep && user.onboardingStep !== formStep) {
      setFormStep(user.onboardingStep)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.onboardingStep])

  const setStepValid = useCallback((step: number, isValid: boolean) => {
    setStepValidity((prev) => (prev[step] === isValid ? prev : { ...prev, [step]: isValid }))
  }, [])

  const educationCount = user?.tutorProfile?.education.length ?? 0

  const isCurrentStepValid =
    formStep === 6
      ? educationCount > 0
      : VALIDATED_STEPS.has(formStep)
        ? !!stepValidity[formStep]
        : true

  const handleSaveCurrentStep = async (): Promise<boolean> => {
    switch (formStep) {
      case 2:
        return (await specialtiesRef.current?.submit()) ?? true
      case 3:
        return (await skillsRef.current?.submit()) ?? true
      case 4:
        return (await headlineRef.current?.submit()) ?? true
      case 7:
        return (await languagesRef.current?.submit()) ?? true
      case 8:
        return (await overviewRef.current?.submit()) ?? true
      case 9:
        return (await hourlyRateRef.current?.submit()) ?? true
      case 10:
        return (await userInfoRef.current?.submit()) ?? true
      default:
        return true
    }
  }

  const steps = [
    {
      stepNumber: 1,
      component: <ImportDataStep onContinue={() => setFormStep(2)} />,
      show: true,
      name: 'import your data',
      canSkip: false,
    },
    {
      stepNumber: 2,
      component: (
        <SpecialtiesStep ref={specialtiesRef} onValidityChange={(v) => setStepValid(2, v)} />
      ),
      show: true,
      name: 'add your specialties',
      canSkip: false,
    },
    {
      stepNumber: 3,
      component: <SkillsStep ref={skillsRef} onValidityChange={(v) => setStepValid(3, v)} />,
      show: true,
      name: 'add your skills',
      canSkip: false,
    },
    {
      stepNumber: 4,
      component: <HeadlineStep ref={headlineRef} onValidityChange={(v) => setStepValid(4, v)} />,
      show: true,
      name: 'add your title',
      canSkip: false,
    },
    {
      stepNumber: 5,
      component: <ExperienceStep />,
      show: true,
      name: 'add your experience',
      canSkip: true,
    },
    {
      stepNumber: 6,
      component: <EducationStep />,
      show: true,
      name: 'add your education',
      canSkip: false,
    },
    {
      stepNumber: 7,
      component: <LanguagesStep ref={languagesRef} onValidityChange={(v) => setStepValid(7, v)} />,
      show: true,
      name: 'add your languages',
      canSkip: false,
    },
    {
      stepNumber: 8,
      component: <OverviewStep ref={overviewRef} onValidityChange={(v) => setStepValid(8, v)} />,
      show: true,
      name: 'write an overview',
      canSkip: false,
    },
    {
      stepNumber: 9,
      component: (
        <HourlyRateStep ref={hourlyRateRef} onValidityChange={(v) => setStepValid(9, v)} />
      ),
      show: true,
      name: 'set your rate',
      canSkip: false,
    },
    {
      stepNumber: 10,
      component: <UserInfoStep ref={userInfoRef} onValidityChange={(v) => setStepValid(10, v)} />,
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

  const isNotTutor = user.role !== 'TUTOR'
  const isCompleted = user.isProfileCompleted

  if (isNotTutor || isCompleted) {
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
        {formStep !== 1 && (
          <StepperButtons
            onNextStep={handleSaveCurrentStep}
            onComplete={() => navigate('/profile', { replace: true })}
            isNextDisabled={!isCurrentStepValid}
            steps={visibleSteps}
          />
        )}
      </form>
    </TutorOnboardingLayout>
  )
}
export default TutorOnboardingPage
