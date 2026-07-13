import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getTimezoneOptions } from '../../utils/timezones'
import WeeklyHours from '../ui/WeeklyHours'

type WeeklyHoursNavProps = {
  timezone: string
  setTimezone: (timezone: string) => void
  onConflict: (error: unknown) => boolean
}

const TIMEZONE_OPTIONS = getTimezoneOptions()

const WeeklyHoursNav = ({ timezone, setTimezone, onConflict }: WeeklyHoursNavProps) => {
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
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Timezone</span>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONE_OPTIONS.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex w-full flex-1">
        <WeeklyHours timezone={timezone} onConflict={onConflict} />
      </div>
    </div>
  )
}

export default WeeklyHoursNav
