import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import MyBookingsList from '@/features/scheduling/components/ui/MyBookingsList'
import MySessionsLayout from '@/features/sessions/components/layout/MySessionsPageLayout'

export type SessionsTabKey = 'UPCOMING' | 'PAST'

const SESSIONS_TABS = [
  { key: 'UPCOMING', label: 'Scheduled' },
  { key: 'PAST', label: 'History' },
]

const SessionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: SessionsTabKey = searchParams.get('tab') === 'PAST' ? 'PAST' : 'UPCOMING'

  const handleTabChange = useCallback(
    (nextTab: SessionsTabKey) => {
      const next = new URLSearchParams(searchParams)
      if (nextTab === 'PAST') next.set('tab', 'PAST')
      else next.delete('tab')
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams]
  )

  return (
    <MySessionsLayout>
      <div className="flex-1 space-y-8">
        <div className="flex items-center gap-3">
          {SESSIONS_TABS.map((step) => (
            <div
              key={step.key}
              className="p-3"
              onClick={() => handleTabChange(step.key as SessionsTabKey)}
            >
              <h4
                className={cn(
                  'text-lg hover:cursor-pointer hover:font-semibold',
                  step.key === tab && 'font-semibold underline'
                )}
              >
                {step.label}
              </h4>
            </div>
          ))}
        </div>
        <MyBookingsList tab={tab} />
      </div>
    </MySessionsLayout>
  )
}

export default SessionsPage
