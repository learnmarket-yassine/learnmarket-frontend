import { ChevronRight } from 'lucide-react'
import React from 'react'

type CustomTabProps = {
  stepNumber: number
  component: React.JSX.Element
  name: string
}
type CustomTabToggleProps = {
  selected: number
  setSelected: (selected: number) => void
  steps: CustomTabProps[]
}
const CustomTabToggle = ({ selected, setSelected, steps }: CustomTabToggleProps) => {
  return (
    <div className="flex flex-col items-start space-y-4">
      {steps.map((step) => (
        <button
          key={step.stepNumber}
          className={`relative flex w-full justify-between text-lg hover:font-semibold md:break-all ${
            selected === step.stepNumber ? 'font-semibold' : 'cursor-pointer'
          }`}
          onClick={() => setSelected(step.stepNumber)}
        >
          {step.name}
          {selected === step.stepNumber && <ChevronRight />}
        </button>
      ))}
    </div>
  )
}

export default CustomTabToggle
