import ChevronStepper from '@/features/learn-requests/components/ui/ChevronStepper'
import LearnRequestDetailsStep from '@/features/learn-requests/components/ui/LearnRequestDetailsStep'
import useGetLearnRequest from '@/features/learn-requests/hooks/useGetLearnRequest'
import { STATUS_LABELS } from '@/features/learn-requests/constants/labels'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

const LearnRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data } = useGetLearnRequest(id)
  const [selected, setSelected] = useState(1)
  const steps = [
    {
      stepNumber: 1,
      component: <LearnRequestDetailsStep id={id as string} />,
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
      <div className="flex items-center justify-between">
        {data ? (
          <>
            <h1 className="text-2xl font-semibold">{data.title}</h1>
            <span className="rounded-full border bg-[#143681] px-4 py-1 text-sm text-white">
              {STATUS_LABELS[data.status]}
            </span>
          </>
        ) : (
          <>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </>
        )}
      </div>
      <div className="w-full space-y-2">
        <ChevronStepper selected={selected} setSelected={setSelected} steps={steps} />
      </div>
      {currentStep?.component || null}
    </div>
  )
}

export default LearnRequestDetailsPage
