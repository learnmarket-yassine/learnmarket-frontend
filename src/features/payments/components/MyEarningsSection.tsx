import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import CustomTable from '@/components/ui/CustomTable/CustomTable'
import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { formatBudget } from '@/lib/utils'
import EmptyState from '@/features/myProfile/components/ui/EmptyState'
import useGetMyPayouts, { MY_PAYOUTS_FILTER_TYPE } from '../hooks/useGetMyPayouts'
import PayoutStatusBadge from './ui/PayoutStatusBadge'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const HEADERS = [
  { optionName: 'date', headerTitle: 'Date', filterParams: { hideSearch: true } },
  {
    optionName: 'learner',
    headerTitle: 'Learner',
    filterParams: { hideOrder: true, hideSearch: true },
  },
  {
    optionName: 'session',
    headerTitle: 'Session',
    filterParams: { hideOrder: true, hideSearch: true },
  },
  {
    optionName: 'amount',
    headerTitle: 'Amount',
    filterParams: { hideOrder: true, hideSearch: true },
  },
  { optionName: 'status', headerTitle: 'Status', filterParams: { hideOrder: true } },
]

const MyEarningsSection = () => {
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetMyPayouts()
  const { ref: sentinelRef, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const payouts = data?.pages.flatMap((page) => page.paginatedResult) ?? []
  const totalEarned = data?.pages[0]?.totalEarned

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError) {
    return <EmptyState message="Something went wrong while loading your earnings." />
  }

  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h2 className="text-4xl font-semibold">Earnings</h2>
          <p className="max-w-[540px]">
            Track your total earnings, see exactly how much you're paid for each completed session,
            and follow the status of every payout, all in one place.
          </p>
        </div>
        <div className="w-72 rounded-2xl bg-blue-900 text-white">
          <div className="flex flex-col gap-2 p-4">
            <span className="text-sm font-normal">Total earned</span>
            <span className="text-4xl font-bold">{formatBudget(totalEarned)} USD</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 rounded-xl border border-[#E0E2E6] p-5">
        <h3 className="text-2xl font-semibold text-blue-900">History</h3>
        <CustomTable
          filterType={MY_PAYOUTS_FILTER_TYPE}
          headers={HEADERS}
          hideActions
          headerAlign="start"
          hasData={payouts.length > 0}
          emptyMessage="You haven't earned anything yet."
          data={
            <>
              {payouts.map((payout) => {
                const learner = payout.session.proposal.learnRequest.learner
                return (
                  <TableRow key={payout.id}>
                    <TableCell>{formatDate(payout.triggeredAt)}</TableCell>
                    <TableCell>
                      {learner.firstname} {learner.lastname}
                    </TableCell>
                    <TableCell>{payout.session.title}</TableCell>
                    <TableCell className="font-semibold text-[#1E293B]">
                      {formatBudget(payout.amount)} TND
                    </TableCell>
                    <TableCell>
                      <PayoutStatusBadge status={payout.status} />
                    </TableCell>
                  </TableRow>
                )
              })}
              {(hasNextPage || isFetchingNextPage) && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={HEADERS.length} className="p-0">
                    <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
                    {isFetchingNextPage && (
                      <div className="flex justify-center py-4 text-sm text-muted-foreground">
                        Loading more...
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </>
          }
        />
      </div>
    </div>
  )
}

export default MyEarningsSection
