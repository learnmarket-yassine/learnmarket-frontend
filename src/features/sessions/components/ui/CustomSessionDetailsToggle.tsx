import React from 'react'

type CustomTabProps = {
  stepNumber: number
  component: React.JSX.Element
  name: string
  enabled: boolean
}
type CustomTabToggleProps = {
  selected: number
  setSelected: (selected: number) => void
  steps: CustomTabProps[]
}
const CustomSessionDetailsTabToggle = ({ selected, setSelected, steps }: CustomTabToggleProps) => {
  return (
    <div className="flex items-center gap-8">
      {steps.map((step) => (
        <button
          key={step.stepNumber}
          className={`text-lg md:break-all ${
            selected === step.stepNumber
              ? 'border-b-2 font-semibold'
              : 'cursor-pointer hover:font-medium disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400'
          }`}
          disabled={!step.enabled}
          onClick={() => setSelected(step.stepNumber)}
        >
          {step.name}
        </button>
      ))}
    </div>
  )
}

export default CustomSessionDetailsTabToggle
