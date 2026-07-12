import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import ConflictDialog from './components/ConflictDialog'
import DateOverrides from './components/DateOverrides'
import WeeklyHours from './components/WeeklyHours'
import { useAvailabilityConflict } from './hooks/useAvailabilityConflict'
import { getBrowserTimezone, getTimezoneOptions } from '../utils/timezones'

const TIMEZONE_OPTIONS = getTimezoneOptions()

const TutorAvailabilityHub = () => {
  const [timezone, setTimezone] = useState(getBrowserTimezone)
  const { conflict, handleError, dismiss } = useAvailabilityConflict()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Availability</h1>
          <p className="text-sm text-muted-foreground">
            Set your weekly hours and manage one-off changes.
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

      <Tabs defaultValue="weekly-hours">
        <TabsList>
          <TabsTrigger value="weekly-hours">Weekly Hours</TabsTrigger>
          <TabsTrigger value="date-overrides">Date Overrides</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly-hours">
          <WeeklyHours timezone={timezone} onConflict={handleError} />
        </TabsContent>
        <TabsContent value="date-overrides">
          <DateOverrides timezone={timezone} onConflict={handleError} />
        </TabsContent>
      </Tabs>

      <ConflictDialog conflict={conflict} onClose={dismiss} timezone={timezone} />
    </div>
  )
}

export default TutorAvailabilityHub
