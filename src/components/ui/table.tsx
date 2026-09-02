import * as React from 'react'
import { cn } from '@/lib/utils'
import ColumnFilter from './ColumnFilter/ColumnFilter'
import { FilterType } from '@/features/table-filters/store/types'
import { useStore } from '@/store/store'
import { FILTER_OPTIONS } from '@/lib/tableFilterOptions'
import ClosedFilterIcon from '@/assets/ClosedFilterIcon'
import { format, parseISO } from 'date-fns'

type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  containerClassName?: string
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <div className={cn('relative h-full w-full overflow-y-auto', containerClassName)}>
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('sticky top-0 z-10 bg-white [&_tr]:border-b', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('overflow-y-auto [&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

type TableHeadProps = {
  optionName: string
  hideArrow?: boolean
  filterType: FilterType
  headerHeight?: string
  filterParams?: {
    hideOrder?: boolean
    hideSearch?: boolean
    hideDate?: boolean
  }
}
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & TableHeadProps
>(
  (
    {
      className,
      children,
      hideArrow,
      optionName,
      filterType,
      headerHeight,
      filterParams,
      ...props
    },
    ref
  ) => {
    const filters = useStore((state) => state.tableFilters.filters)[filterType] || []
    const setFilters = useStore((state) => state.tableFilters.setTableFilters)

    const formatDate = (dateString: string) => {
      try {
        const date = parseISO(dateString)
        return format(date, 'MM/dd/yyyy')
      } catch {
        return dateString
      }
    }

    const handleClearFilter = (optionName: string, filterValue: string) => {
      if (typeof setFilters !== 'function') return
      const updatedFilters = filters.filter(
        (filter) => !(filter.optionName === optionName && filter.filterValue === filterValue)
      )
      setFilters(filterType, updatedFilters)
    }

    const getFilterName = (optionName: string, filterValue: string): string | undefined => {
      const options = FILTER_OPTIONS[filterType]?.[optionName]
      return options?.find((option) => option.value === filterValue)?.name
    }
    const getValueOfOrderFilter = (filterValue: string) => {
      return filterValue === 'desc' ? 'Descending order' : 'Ascending order'
    }

    const shownFilters = filters.filter((filter) => filter.optionName === optionName)

    return (
      <th
        ref={ref}
        className={`relative ${headerHeight ? headerHeight : 'h-20 lg:h-20'} cursor-pointer whitespace-nowrap px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0`}
        {...props}
      >
        <div className={cn('flex items-center gap-3', className)}>
          {children}
          {!hideArrow && (
            <div className="flex items-center justify-center">
              <ColumnFilter
                filterType={filterType}
                filterParams={filterParams}
                optionName={optionName}
              />
              {shownFilters.length > 0 &&
                shownFilters.map((currentFilter, index) => (
                  <div
                    key={currentFilter.filterKey}
                    style={{ transform: 'translateX(-50%)' }}
                    className={`absolute left-[50%] ${index === 0 ? 'top-[60%]' : 'top-[80%]'} flex items-center justify-between rounded-[6px] bg-[#F0F0F0] px-1`}
                  >
                    <span className="min-w-[70px] flex-1 text-center text-[#2563EB] lg:min-w-[90px]">
                      {currentFilter.filterKey === 'radio'
                        ? getFilterName(currentFilter.optionName, currentFilter.filterValue)
                        : currentFilter.filterKey === 'order'
                          ? getValueOfOrderFilter(currentFilter.filterValue)
                          : currentFilter.filterKey === 'date'
                            ? formatDate(currentFilter.filterValue)
                            : currentFilter.filterValue}
                    </span>
                    <button
                      className="ml-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#2563EB]"
                      onClick={() =>
                        handleClearFilter(currentFilter.optionName, currentFilter.filterValue)
                      }
                    >
                      <ClosedFilterIcon />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </th>
    )
  }
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
))
TableCaption.displayName = 'TableCaption'

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
