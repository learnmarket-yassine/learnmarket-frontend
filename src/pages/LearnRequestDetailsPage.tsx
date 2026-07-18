import ChevronStepper from '@/features/learn-requests/components/ui/ChevronStepper'
import { useState } from 'react'

const LearnRequestDetailsPage = () => {
  const [selected, setSelected] = useState(1)
  const steps = [
    {
      stepNumber: 1,
      component: <h1>learn post</h1>,
      show: true,
      name: 'view Learn Post',
      enabled: true,
    },
    {
      stepNumber: 2,
      component: <h1>Review proposals</h1>,
      show: true,
      name: 'Review proposals',
      enabled: true,
    },
    {
      stepNumber: 3,
      component: <h1>Hiring</h1>,
      show: true,
      name: ' Hiring',
      enabled: true,
    },
    {
      stepNumber: 4,
      component: <h1>Sessions</h1>,
      show: true,
      name: 'Sessions',
      enabled: true,
    },
  ]
  const visibleSteps = steps.filter((step) => step.show)
  const currentStep = visibleSteps.find((step) => step.stepNumber === selected)

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="w-full space-y-2">
        <ChevronStepper selected={selected} setSelected={setSelected} steps={steps} />
      </div>
      {currentStep?.component || null}
    </div>
  )
}

export default LearnRequestDetailsPage
