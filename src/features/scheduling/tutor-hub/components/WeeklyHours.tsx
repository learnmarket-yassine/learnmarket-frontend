import { Skeleton } from '@/components/ui/skeleton'
import { useAvailabilityRules } from '../hooks/useAvailabilityRules'
import WeeklyHoursForm from './WeeklyHoursForm'

export interface WeeklyHoursProps {
  timezone: string
  onConflict: (error: unknown) => boolean
}

const WeeklyHours = ({ timezone, onConflict }: WeeklyHoursProps) => {
  const rulesQuery = useAvailabilityRules()

  if (rulesQuery.isPending) {
    return (
      <div className="flex flex-col gap-3 py-4">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (rulesQuery.isError) {
    return <p className="py-4 text-sm text-destructive">Couldn&apos;t load your weekly hours.</p>
  }

  const rules = rulesQuery.data
  // Remounts (and re-derives defaultValues) only when the persisted rules actually change,
  // e.g. right after a save picks up server-assigned ids for newly created slots.
  const formKey = rules.map((rule) => `${rule.id}:${rule.updatedAt}`).join('|')

  return <WeeklyHoursForm key={formKey} rules={rules} timezone={timezone} onConflict={onConflict} />
}

export default WeeklyHours
