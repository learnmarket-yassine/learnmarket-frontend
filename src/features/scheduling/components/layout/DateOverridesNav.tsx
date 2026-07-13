import DateOverrides from '../ui/DateOverrides'

type DateOverridesNavProps = {
  timezone: string
  onConflict: (error: unknown) => boolean
}

const DateOverridesNav = ({ timezone, onConflict }: DateOverridesNavProps) => {
  return (
    <div className="h-full w-full flex-1 flex-col space-y-6">
      <div className="flex w-full items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#1E293B]">Manage Date Overrides</h1>
          <p className="text-sm text-[#4B5563]">
            Adjust your schedule for individual dates. Add extra availability or block time when
            you're unavailable. Date overrides always override your regular weekly availability.
          </p>
        </div>
      </div>
      <div className="flex w-full flex-1">
        <DateOverrides timezone={timezone} onConflict={onConflict} />
      </div>
    </div>
  )
}

export default DateOverridesNav
