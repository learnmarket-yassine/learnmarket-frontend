import { Command, CommandGroup, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ArrowDownIcon from '@/assets/ArrowDownIcon'
import { cn } from '@/lib/utils'
import { FilterType, TableFilter } from '@/features/table-filters/store/types'
import { Button } from '../button'
import { useStore } from '@/store/store'
import ColumnOptions from './ColumnOptions/ColumnOptions'
import { useEffect, useState } from 'react'
import { customFilters, customOrders } from './customFilters'
import OrderFilters from './OrderFilters'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

type Props = {
  optionName: string
  filterType: FilterType
  filterParams?: {
    hideOrder?: boolean
    hideSearch?: boolean
    hideDate?: boolean
  }
}

const ColumnFilter = (props: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={cn('flex items-center gap-3 p-2')}>
          <ArrowDownIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 text-black"
        style={{
          boxShadow: '0px 2.256px 27.067px 0px rgba(0, 0, 0, 0.10)',
        }}
        align="end"
      >
        <Filters
          filterType={props.filterType}
          filterParams={props.filterParams}
          optionName={props.optionName}
          setShowFilter={setOpen}
        />
      </PopoverContent>
    </Popover>
  )
}

type TProps = {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>
  optionName: string
  filterType: FilterType
  filterParams?: {
    hideOrder?: boolean
    hideSearch?: boolean
    hideDate?: boolean
  }
}

const Filters = ({
  filterType,
  optionName,
  filterParams = { hideDate: true },
  setShowFilter,
}: TProps) => {
  const filters = useStore((state) => state.tableFilters.filters)[filterType] || []
  const setFilters = useStore((state) => state.tableFilters.setTableFilters)
  const [selectedOrder, setSelectedOrder] = useState<string>('')
  const [selectedRadio, setSelectedRadio] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const localDate = new Date(date)
      const utcDate = new Date(
        Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
      )
      setSelectedDate(utcDate)
      setIsPopoverOpen(false)
    }
  }

  const handleSubmitFilter = () => {
    if (!setFilters) return

    const newFilters: TableFilter[] = [
      ...(selectedOrder
        ? [
            {
              optionName: optionName || '',
              filterKey: 'order' as const,
              filterValue: selectedOrder,
            },
          ]
        : []),
      ...(selectedRadio
        ? [
            {
              optionName: optionName || '',
              filterKey: 'radio' as const,
              filterValue: selectedRadio,
            },
          ]
        : []),
      ...(keyword.trim()
        ? [{ optionName: optionName || '', filterKey: 'keyword' as const, filterValue: keyword }]
        : []),
      ...(filterParams.hideDate === false && selectedDate
        ? [
            {
              optionName: optionName || '',
              filterKey: 'date' as const,
              filterValue: selectedDate.toISOString(),
            },
          ]
        : []),
    ]
    applyCustomFilters(newFilters)
    applyCustomOrders(newFilters)

    setFilters(filterType, [
      ...filters.filter((filter) => filter.optionName !== optionName),
      ...newFilters,
    ])

    setShowFilter(false)
  }

  const applyCustomFilters = (newFilters: TableFilter[]) => {
    newFilters.forEach((filter) => {
      const filterFunction = customFilters[filterType]?.filters[filter.optionName]
      if (filterFunction && (filter.filterKey === 'radio' || filter.filterKey === 'keyword')) {
        filter.customFilter = filterFunction(filter.filterValue)
      }
    })
  }

  const applyCustomOrders = (filters: TableFilter[]) => {
    filters.forEach((filter) => {
      const filterFunction = customOrders[filterType]?.filters[filter.optionName]
      if (filterFunction && filter.filterKey === 'order') {
        filter.customOrder = filterFunction(filter.filterValue)
      }
    })
  }

  const handleClearFilter = () => {
    if (typeof setFilters === 'function') {
      const updatedFilters = filters.filter((filter) => filter.optionName !== optionName)
      setFilters(filterType, updatedFilters)
    }
    setShowFilter(false)
  }

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

  useEffect(() => {
    filters
      .filter((filter) => filter.optionName === optionName)
      .forEach((filter) => {
        if (filter.filterKey === 'order') setSelectedOrder(filter.filterValue)
        else if (filter.filterKey === 'radio') setSelectedRadio(filter.filterValue)
        else if (filter.filterKey === 'keyword') setKeyword(filter.filterValue)
      })
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [filters, optionName])

  return (
    <div>
      {!filterParams?.hideOrder && (
        <>
          <Command>
            <CommandList>
              <CommandGroup>
                <OrderFilters
                  filterType={filterType}
                  optionName={optionName}
                  selectedOption={selectedOrder}
                  onSelectOption={setSelectedOrder}
                  handleSubmitFilter={handleSubmitFilter}
                />
              </CommandGroup>
            </CommandList>
          </Command>
          {!filterParams?.hideSearch && <hr />}
        </>
      )}

      {!filterParams?.hideSearch && (
        <div className="space-y-4">
          <ColumnOptions
            filterType={filterType}
            optionName={optionName}
            defaultKeyword={keyword}
            setKeyword={setKeyword}
            selectedRadio={selectedRadio}
            onSelectRadio={setSelectedRadio}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}

      {filterParams?.hideDate === false && (
        <div className="space-y-4">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full justify-start text-left font-normal')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div className="flex w-full items-center space-x-3 pt-4">
        <Button variant="outline" type="button" onClick={handleClearFilter} className="w-1/2">
          Cancel
        </Button>

        <Button className="w-1/2" type="button" onClick={handleSubmitFilter}>
          OK
        </Button>
      </div>
    </div>
  )
}

export default ColumnFilter
