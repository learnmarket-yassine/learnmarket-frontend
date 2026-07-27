import DateOverridesNav from '@/features/scheduling/components/layout/DateOverridesNav'
import TutorAvailabilityLayout from '@/features/scheduling/components/layout/TutorAvailabilityLayout'
import WeeklyHoursNav from '@/features/scheduling/components/layout/WeeklyHoursNav'
import CustomToggle from '@/features/scheduling/components/ui/CustomToggle'
import { useAvailabilityConflict } from '@/features/scheduling/hooks/useAvailabilityConflict'
import ConflictDialog from '@/features/scheduling/components/ui/ConflictDialog'
import { getBrowserTimezone } from '@/features/scheduling/utils/timezones'
import { useState } from 'react'

const TutorAvailabilityPage = () => {
  const timezone = getBrowserTimezone()
  const { conflict, handleError, dismiss } = useAvailabilityConflict()
  const [selected, setSelected] = useState(1)
  const steps = [
    {
      stepNumber: 1,
      component: <WeeklyHoursNav timezone={timezone} onConflict={handleError} />,
      show: true,
      name: 'Weekly Hours',
      enabled: true,
    },
    {
      stepNumber: 2,
      component: <DateOverridesNav timezone={timezone} onConflict={handleError} />,
      show: true,
      name: 'Date Overrides',
      enabled: true,
    },
  ]
  const visibleSteps = steps.filter((step) => step.show)
  const currentStep = visibleSteps.find((step) => step.stepNumber === selected)

  return (
    <TutorAvailabilityLayout>
      <div className="flex w-full flex-col gap-10">
        <div className="w-full space-y-2">
          <CustomToggle selected={selected} setSelected={setSelected} steps={steps} />
        </div>
        {currentStep?.component || null}

        <ConflictDialog conflict={conflict} onClose={dismiss} timezone={timezone} />
      </div>
    </TutorAvailabilityLayout>
  )
}

export default TutorAvailabilityPage
