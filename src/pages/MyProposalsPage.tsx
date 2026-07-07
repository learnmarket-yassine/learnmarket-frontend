import { useStore } from '@/store/store'
import useMyProposals from '@/features/proposals/hooks/useMyProposals'
import useWithdrawProposal from '@/features/proposals/hooks/useWithdrawProposal'
import { ProposalStatus } from '@/features/proposals/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DemoNav from '@/components/layout/DemoNav'

const STATUS_VARIANT: Record<ProposalStatus, 'default' | 'destructive' | 'secondary'> = {
  PENDING: 'default',
  ACCEPTED: 'default',
  DECLINED: 'destructive',
  WITHDRAWN: 'secondary',
}

const MyProposalsPage = () => {
  const user = useStore((state) => state.auth.user)
  const proposalsQuery = useMyProposals()
  const withdrawProposal = useWithdrawProposal()

  if (user?.role !== 'TUTOR') {
    return (
      <div className="flex flex-col gap-4">
        <DemoNav />
        <p>Only tutors submit proposals.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <DemoNav />
      <h1 className="text-2xl font-bold">My proposals</h1>

      <div className="flex flex-col gap-3">
        {proposalsQuery.data?.length === 0 && <p>You haven't submitted any proposals yet.</p>}
        {proposalsQuery.data?.map((proposal) => (
          <div key={proposal.id} className="flex flex-col gap-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{proposal.annonce?.title ?? proposal.annonceId}</h3>
              <Badge variant={STATUS_VARIANT[proposal.status]}>{proposal.status}</Badge>
            </div>
            {proposal.message && <p className="text-sm text-gray-600">{proposal.message}</p>}
            <p className="text-xs text-gray-400">{new Date(proposal.createdAt).toLocaleString()}</p>
            {proposal.status === 'PENDING' && (
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => withdrawProposal.mutate(proposal.id)}
                disabled={withdrawProposal.isPending}
              >
                Withdraw
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyProposalsPage
