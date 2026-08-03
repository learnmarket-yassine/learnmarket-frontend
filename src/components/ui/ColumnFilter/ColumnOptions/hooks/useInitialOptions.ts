import { useMemo } from 'react'
import { FilterType } from '@/features/table-filters/store/types'
import { FILTER_OPTIONS } from '@/lib/tableFilterOptions'
import { FilterOption } from '../types'

type UseInitialOptionsResult = {
  initialOptions: FilterOption[]
  isLoading: boolean
}

const useInitialOptions = (filterType: FilterType, optionName: string): UseInitialOptionsResult => {
  const initialOptions = useMemo<FilterOption[]>(
    () => FILTER_OPTIONS[filterType]?.[optionName] ?? [],
    [filterType, optionName]
  )

  return { initialOptions, isLoading: false }
}

export default useInitialOptions
