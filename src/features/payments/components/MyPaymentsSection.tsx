import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import CustomTable from '@/components/ui/CustomTable/CustomTable'
import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { formatBudget } from '@/lib/utils'
import EmptyState from '@/features/myProfile/components/ui/EmptyState'
import useGetMyPayments, { MY_PAYMENTS_FILTER_TYPE } from '../hooks/useGetMyPayments'
import PaymentStatusBadge from './ui/PaymentStatusBadge'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const HEADERS = [
  { optionName: 'date', headerTitle: 'Date', filterParams: { hideSearch: true } },
  {
    optionName: 'tutor',
    headerTitle: 'Tutor',
    filterParams: { hideOrder: true, hideSearch: true },
  },
  {
    optionName: 'course',
    headerTitle: 'Course',
    filterParams: { hideOrder: true, hideSearch: true },
  },
  {
    optionName: 'amount',
    headerTitle: 'Amount',
    filterParams: { hideOrder: true, hideSearch: true },
  },
  { optionName: 'status', headerTitle: 'Status', filterParams: { hideOrder: true } },
]

const MyPaymentsSection = () => {
  const {
    data,
    isLoading,
    isError,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetMyPayments()
  const { ref: sentinelRef, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const payments = data?.pages.flatMap((page) => page.paginatedResult) ?? []
  const totalSpent = data?.pages[0]?.totalSpent

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
    return <EmptyState message="Something went wrong while loading your payments." />
  }

  return (
    <div className={`space-y-6 ${isPlaceholderData ? 'opacity-60' : ''}`}>
      <div>
        <h2 className="text-2xl font-semibold text-[#1E293B]">Payments</h2>
        <p className="mt-1 text-lg font-bold text-[#1E293B]">
          Total spent: {formatBudget(totalSpent)} TND
        </p>
      </div>
      <CustomTable
        filterType={MY_PAYMENTS_FILTER_TYPE}
        headers={HEADERS}
        hideActions
        headerAlign="start"
        hasData={payments.length > 0}
        emptyMessage="You haven't made any payments yet."
        data={
          <>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
                <TableCell>
                  {payment.proposal.tutor.firstname} {payment.proposal.tutor.lastname}
                </TableCell>
                <TableCell>{payment.proposal.learnRequest.title}</TableCell>
                <TableCell className="font-semibold text-[#1E293B]">
                  {formatBudget(payment.amount)} TND
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={payment.status} />
                </TableCell>
              </TableRow>
            ))}
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

export default MyPaymentsSection
