import useGetAvailabilityRules from '../../hooks/useGetAvailabilityRules'
import WeeklyHoursForm from './WeeklyHoursForm'
import { Skeleton } from '@/components/ui/skeleton'

type WeeklyHoursNavProps = {
  timezone: string
  onConflict: (error: unknown) => boolean
}

const WeeklyHours = ({ timezone, onConflict }: WeeklyHoursNavProps) => {
  const rulesQuery = useGetAvailabilityRules()

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
    return <p className="py-4 text-sm text-destructive">Couldn't load your weekly hours.</p>
  }

  const rules = rulesQuery.data
  // Remounts (and re-derives defaultValues) only when the persisted rules actually change,
  // e.g. right after a save picks up server-assigned ids for newly created slots.
  const formKey = rules.map((rule) => `${rule.id}:${rule.updatedAt}`).join('|')

  return <WeeklyHoursForm key={formKey} rules={rules} timezone={timezone} onConflict={onConflict} />
}

export default WeeklyHours
