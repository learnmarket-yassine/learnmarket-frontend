import { useStore } from '@/store/store'
import { JSX } from 'react'
import { Button } from '@/components/ui/button'

export type StepProps = {
  stepNumber: number
  component: JSX.Element // The component to render for the step
  show: boolean // Condition to determine if the step should be shown
  name: string // Condition to determine if the step should be shown
  canSkip?: boolean
}

type StepperButtonsProps = {
  steps: StepProps[]
  onNextStep: () => Promise<void> | void
  onSkip?: () => void
}

const StepperButtons = ({ onNextStep, onSkip, steps }: StepperButtonsProps) => {
  const formStep = useStore((state) => state.onBoarding.formStep)
  const setFormStep = useStore((state) => state.onBoarding.setFormStep)

  // Find the index of the current form step in the visible steps
  const currentStepIndex = steps.findIndex((step) => step.stepNumber === formStep)

  const currentStep = steps[currentStepIndex]

  const isLastStep = currentStepIndex === steps.length - 1
  // Determine the next and previous step numbers
  const nextStepNumber = !isLastStep ? steps[currentStepIndex + 1]?.stepNumber : undefined
  const nextStepTitle = !isLastStep ? steps[currentStepIndex + 1].name : 'undefined'

  const prevStepNumber = currentStepIndex > 0 ? steps[currentStepIndex - 1]?.stepNumber : undefined

  const handleNextStep = async () => {
    if (typeof onNextStep === 'function' && nextStepNumber) {
      //   await onNextStep()
      setFormStep(nextStepNumber)
    }
  }

  const handleSkip = () => {
    onSkip?.()
    if (nextStepNumber) {
      setFormStep(nextStepNumber)
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
            setFormStep(prevStepNumber)
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
          className="h-full rounded-full bg-[#2563EB] px-8 py-[10px] font-semibold text-white hover:bg-[#2563EB] hover:text-white"
          onClick={handleNextStep}
        >
          {isLastStep ? 'Submit' : `Next, ${nextStepTitle}`}
        </Button>
      </div>
    </div>
  )
}

export default StepperButtons
