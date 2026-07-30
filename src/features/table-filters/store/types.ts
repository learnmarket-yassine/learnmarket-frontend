// New filterable tables register their domain here, exactly like SitesPage/store/types.ts's
// FilterType did in the reference project -- add a literal and a matching TableFilters entry.
export type FilterType = 'payments' | 'payouts'

export type TableFilter = {
  optionName: string
  filterKey: 'order' | 'radio' | 'keyword' | 'date'
  filterValue: string
  customFilter?: string
  customOrder?: string
}

export type TableFilters = Record<FilterType, TableFilter[]>

export type TableFiltersSlice = {
  tableFilters: {
    filters: TableFilters
    setTableFilters: (filterType: FilterType, filters: TableFilter[]) => void
  }
}
