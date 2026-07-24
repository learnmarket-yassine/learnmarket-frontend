import MyProposalsLayout from '@/features/proposal/components/layout/MyProposalsLayout'
import MyProposalsList from '@/features/proposal/components/ui/MyProposalsList'
import { ProposalGroup } from '@/features/proposal/store/types'
import { cn } from '@/lib/utils'
import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const MyProposalsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = useMemo(
    () => Math.max(0, Number(searchParams.get('page') ?? '0') || 0),
    [searchParams]
  )

  const setPage = useCallback(
    (nextPage: number) => {
      const next = new URLSearchParams(searchParams)
      if (nextPage > 0) next.set('page', String(nextPage))
      else next.delete('page')
      setSearchParams(next)
    },
    [searchParams, setSearchParams]
  )

  const group: ProposalGroup = searchParams.get('tab') === 'ARCHIVED' ? 'ARCHIVED' : 'ACTIVE'

  const MyProposalsSteps = [
    {
      group: 'ACTIVE' as ProposalGroup,
      name: 'Active',
      enabled: true,
    },
    {
      group: 'ARCHIVED' as ProposalGroup,
      name: 'Archived',
      enabled: true,
    },
  ]

  const handleTabChange = useCallback(
    (nextGroup: ProposalGroup) => {
      const next = new URLSearchParams(searchParams)
      if (nextGroup === 'ARCHIVED') next.set('tab', 'ARCHIVED')
      else next.delete('tab')
      next.delete('page')
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams]
  )
  return (
    <MyProposalsLayout>
      <div className="flex items-center gap-3">
        {MyProposalsSteps.map((step) => (
          <div key={step.group} className="p-3" onClick={() => handleTabChange(step.group)}>
            <h4
              className={cn(
                'text-lg hover:cursor-pointer hover:font-semibold',
                step.group === group && 'font-semibold underline'
              )}
            >
              {step.name}
            </h4>
          </div>
        ))}
      </div>
      <MyProposalsList group={group} page={page} setPage={setPage} />
    </MyProposalsLayout>
  )
}

export default MyProposalsPage
