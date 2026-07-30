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
  const {
    data,
    isLoading,
    isError,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetMyPayouts()
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
    <div className={`space-y-6 ${isPlaceholderData ? 'opacity-60' : ''}`}>
      <div>
        <h2 className="text-2xl font-semibold text-[#1E293B]">Earnings</h2>
        <p className="mt-1 text-lg font-bold text-[#1E293B]">
          Total earned: {formatBudget(totalEarned)} TND
        </p>
      </div>
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
  )
}

export default MyEarningsSection
