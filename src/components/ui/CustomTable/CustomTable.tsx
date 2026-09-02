import type { FilterType } from '@/features/table-filters/store/types'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../table'
import NoResults from '../NoResults'
import { useStore } from '@/store/store'

type HeaderInfo = {
  optionName: string
  headerTitle: string
  filterParams?: {
    hideOrder?: boolean
    hideSearch?: boolean
    hideDate?: boolean
  }
}
type Props = {
  headers: HeaderInfo[]
  filterType: FilterType
  data: React.ReactNode
  hideActions?: boolean
  hasData?: boolean
  headerCellColor?: string
  headerTitleColor?: string
  headerAlign?: 'start' | 'center'
  emptyMessage?: string
  tableContainerClassName?: string
}

const CustomTable = (props: Props) => {
  const filters = useStore((state) => state.tableFilters.filters)[props.filterType] || []
  const hasFiltersApplied = filters.length > 0

  return (
    <Table containerClassName={props.tableContainerClassName}>
      <TableHeader>
        <TableRow>
          {props.headers.map((header) => (
            <TableHead
              key={header.headerTitle}
              optionName={header.optionName}
              filterType={props.filterType}
              hideArrow={
                (header.filterParams?.hideOrder && header.filterParams?.hideSearch) ?? false
              }
              filterParams={header.filterParams}
              className={`${props.headerAlign === 'start' ? 'justify-start' : 'justify-center'} ${
                props.headerCellColor ? `text-[${props.headerCellColor}]` : ''
              }`}
            >
              <span className={props.headerTitleColor ? `text-[${props.headerTitleColor}]` : ''}>
                {header.headerTitle}
              </span>
            </TableHead>
          ))}
          {!props.hideActions && (
            <TableHead
              className={`${props.headerAlign === 'start' ? 'justify-start' : 'justify-center'}`}
              optionName={''}
              hideArrow={true}
              filterType={props.filterType}
            >
              Actions
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      {props.hasData || (props.hasData === undefined && !!props.data) ? (
        <TableBody className="h-full overflow-y-auto">{props.data}</TableBody>
      ) : hasFiltersApplied ? (
        <tbody>
          <tr>
            <td colSpan={props.headers.length + (props.hideActions ? 0 : 1)}>
              <div className="flex justify-center py-10">
                <NoResults />
              </div>
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody>
          <tr>
            <td colSpan={props.headers.length + (props.hideActions ? 0 : 1)}>
              <div className="flex h-40 items-center justify-center">
                <span className="text-center text-xl font-bold text-gray-300">
                  {props.emptyMessage ?? 'No data found.'}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      )}
    </Table>
  )
}

export default CustomTable
