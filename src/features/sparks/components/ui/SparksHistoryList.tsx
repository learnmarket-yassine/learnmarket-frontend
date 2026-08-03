import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import CustomTable from '@/components/ui/CustomTable/CustomTable'
import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/features/myProfile/components/ui/EmptyState'
import useGetSparksHistory, { SPARKS_HISTORY_FILTER_TYPE } from '../../hooks/useGetSparksHistory'
import { SparksTransactionType } from '../../store/types'
import Loader from '@/components/ui/Loader/Loader'

const TYPE_LABELS: Record<SparksTransactionType, string> = {
  MONTHLY_GRANT: 'Monthly grant',
  PURCHASE: 'Purchase',
  PROPOSAL_SPEND: 'Proposal sent',
  REFUND: 'Refund',
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const HEADERS = [
  { optionName: 'date', headerTitle: 'Date', filterParams: { hideSearch: true } },
  {
    optionName: 'action',
    headerTitle: 'Action',
    filterParams: { hideOrder: true, hideSearch: true },
  },
  {
    optionName: 'sparks',
    headerTitle: 'Sparks',
    filterParams: { hideOrder: true, hideSearch: true },
  },
]

const SparksHistoryList = () => {
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetSparksHistory()
  const { ref: sentinelRef, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const transactions = data?.pages.flatMap((page) => page.paginatedResult) ?? []

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    )
  }

  if (isError) {
    return <EmptyState message="Something went wrong while loading your Sparks activity." />
  }

  return (
    <CustomTable
      filterType={SPARKS_HISTORY_FILTER_TYPE}
      headers={HEADERS}
      hideActions
      headerAlign="start"
      hasData={transactions.length > 0}
      emptyMessage="No Sparks activity yet."
      data={
        <>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.createdAt)}</TableCell>
              <TableCell>{TYPE_LABELS[transaction.type]}</TableCell>
              <TableCell
                className={
                  transaction.amount >= 0
                    ? 'font-semibold text-emerald-600'
                    : 'font-semibold text-red-600'
                }
              >
                {transaction.amount >= 0 ? '+' : ''}
                {transaction.amount}
              </TableCell>
            </TableRow>
          ))}
          {(hasNextPage || isFetchingNextPage) && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={HEADERS.length} className="p-0">
                <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
                {isFetchingNextPage && (
                  <div className="flex justify-center py-4 text-sm text-muted-foreground">
                    <Loader />
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </>
      }
    />
  )
}

export default SparksHistoryList
