import { useMemo } from 'react'
import { FilterType } from '@/features/table-filters/store/types'
import { FILTER_OPTIONS } from '@/lib/tableFilterOptions'
import { FilterOption } from '../types'

type UseInitialOptionsResult = {
  initialOptions: FilterOption[]
  isLoading: boolean
}

// The reference project's version of this hook fetches async, entity-specific
// option lists (roles, sites, companies) belonging to that app's domain.
// This app has no equivalent entities yet, so options come straight from the
// static FILTER_OPTIONS registry. If a future column needs server-loaded
// options (e.g. a searchable tutor list), that's a real useQuery call slotted
// in here -- same extension point the reference project used.
const useInitialOptions = (filterType: FilterType, optionName: string): UseInitialOptionsResult => {
  const initialOptions = useMemo<FilterOption[]>(
    () => FILTER_OPTIONS[filterType]?.[optionName] ?? [],
    [filterType, optionName]
  )

  return { initialOptions, isLoading: false }
}

export default useInitialOptions
