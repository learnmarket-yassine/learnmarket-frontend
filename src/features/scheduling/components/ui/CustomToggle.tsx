import React from 'react'

type CustomStepProps = {
  stepNumber: number
  component: React.JSX.Element
  show: boolean
  name: string
  enabled: boolean
}
type CustomToggleProps = {
  selected: number
  setSelected: (selected: number) => void
  steps: CustomStepProps[]
}
const CustomToggle = ({ selected, setSelected, steps }: CustomToggleProps) => {
  return (
    <div className="grid grid-cols-2">
      {steps.map((step) => (
        <button
          key={step.stepNumber}
          className={`relative rounded-t-full border-2 border-[#1a46a7] px-8 py-2 font-semibold transition md:break-all ${
            selected === step.stepNumber
              ? 'border-[#1a46a7] bg-[#1a46a7] text-white'
              : 'cursor-pointer border-[#1a46a7] bg-white text-[#1a46a7] hover:bg-[#f0f0ff] disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
          }`}
          onClick={() => setSelected(step.stepNumber)}
          disabled={!step.enabled}
        >
          {step.name}
        </button>
      ))}
    </div>
  )
}

export default CustomToggle
