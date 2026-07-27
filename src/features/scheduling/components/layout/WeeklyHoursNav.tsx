import WeeklyHours from '../ui/WeeklyHours'

type WeeklyHoursNavProps = {
  timezone: string
  onConflict: (error: unknown) => boolean
}

const WeeklyHoursNav = ({ timezone, onConflict }: WeeklyHoursNavProps) => {
  return (
    <div className="h-full w-full flex-1 flex-col space-y-6">
      <div className="flex w-full items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#1E293B]">Manage Weekly Availabilit</h1>
          <p className="text-sm text-[#4B5563]">
            Define your recurring weekly schedule and choose your timezone. You can later customize
            individual dates using date overrides for holidays, time off, or extra availability.
          </p>
        </div>
      </div>
      <div className="flex w-full flex-1">
        <WeeklyHours timezone={timezone} onConflict={onConflict} />
      </div>
    </div>
  )
}

export default WeeklyHoursNav
