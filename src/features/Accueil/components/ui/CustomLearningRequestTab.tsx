import React from 'react'

type CustomStepProps = {
  stepNumber: number
  component: React.JSX.Element
  show: boolean
  name: string
}
type LearningRequestCustomToggleProps = {
  selected: number
  setSelected: (selected: number) => void
  steps: CustomStepProps[]
}
const LearningRequestCustomToggle = ({
  selected,
  setSelected,
  steps,
}: LearningRequestCustomToggleProps) => {
  return (
    <div className="flex items-center gap-3">
      {steps.map((step) => (
        <button
          key={step.stepNumber}
          className={`relative font-semibold text-[#1a46a7] transition md:break-all ${
            selected === step.stepNumber ? 'underline' : 'cursor-pointer text-black'
          }`}
          onClick={() => setSelected(step.stepNumber)}
        >
          {step.name}
        </button>
      ))}
    </div>
  )
}

export default LearningRequestCustomToggle
