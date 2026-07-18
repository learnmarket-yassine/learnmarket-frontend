type WizardProgressProps = {
  currentStep: number
  totalSteps: number
}

const WizardProgress = ({ currentStep, totalSteps }: WizardProgressProps) => {
  const percent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100))

  return (
    <div className="w-full">
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default WizardProgress
