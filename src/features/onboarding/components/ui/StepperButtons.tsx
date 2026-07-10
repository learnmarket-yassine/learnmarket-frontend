import { useStore } from '@/store/store'
import { JSX, useState } from 'react'
import { Button } from '@/components/ui/button'

export type StepHandle = {
  submit: () => Promise<boolean>
}

export type StepProps = {
  stepNumber: number
  component: JSX.Element // The component to render for the step
  show: boolean // Condition to determine if the step should be shown
  name: string // Condition to determine if the step should be shown
  canSkip?: boolean
}

type StepperButtonsProps = {
  steps: StepProps[]
  onNextStep: () => Promise<boolean>
  onSkip?: () => void
  onComplete?: () => void
  isNextDisabled?: boolean
}

const StepperButtons = ({
  onNextStep,
  onSkip,
  onComplete,
  steps,
  isNextDisabled,
}: StepperButtonsProps) => {
  const formStep = useStore((state) => state.onBoarding.formStep)
  const setFormStep = useStore((state) => state.onBoarding.setFormStep)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Find the index of the current form step in the visible steps
  const currentStepIndex = steps.findIndex((step) => step.stepNumber === formStep)

  const currentStep = steps[currentStepIndex]

  const isLastStep = currentStepIndex === steps.length - 1
  // Determine the next and previous step numbers
  const nextStepNumber = !isLastStep ? steps[currentStepIndex + 1]?.stepNumber : undefined
  const nextStepTitle = !isLastStep ? steps[currentStepIndex + 1].name : 'undefined'

  const prevStepNumber = currentStepIndex > 0 ? steps[currentStepIndex - 1]?.stepNumber : undefined

  // Navigation is local-only now: the backend derives the resume step live
  // from actual saved data (see users.service.ts), so there's nothing to
  // persist on next/back — only each step's own save call matters.
  const goToStep = (step: number) => {
    setFormStep(step)
  }

  const handleNextStep = async () => {
    setIsSubmitting(true)
    try {
      const canProceed = await onNextStep()
      if (!canProceed) return
      if (nextStepNumber) {
        goToStep(nextStepNumber)
      } else {
        onComplete?.()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    onSkip?.()
    if (nextStepNumber) {
      goToStep(nextStepNumber)
    }
  }

  return (
    <div className="flex w-full items-center justify-between gap-5">
      <Button
        type="button"
        variant={'outline'}
        className="h-full rounded-full border-[#D1D5DB] px-8 py-[10px] font-semibold text-[#143681] hover:text-[#143681]"
        onClick={() => {
          if (prevStepNumber) {
            goToStep(prevStepNumber)
          }
        }}
      >
        Back
      </Button>
      <div className="flex items-center gap-8">
        {currentStep?.canSkip && !isLastStep && (
          <button
            type="button"
            onClick={handleSkip}
            className="text-base font-semibold text-[#143681] hover:text-[#143681]"
          >
            Skip for now
          </button>
        )}
        <Button
          type="button"
          disabled={isSubmitting || isNextDisabled}
          className="h-full rounded-full bg-[#2563EB] px-8 py-[10px] font-semibold text-white hover:bg-[#2563EB] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleNextStep}
        >
          {isSubmitting ? 'Saving...' : isLastStep ? 'Submit' : `Next, ${nextStepTitle}`}
        </Button>
      </div>
    </div>
  )
}

export default StepperButtons
