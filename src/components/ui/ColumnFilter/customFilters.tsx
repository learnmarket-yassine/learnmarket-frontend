import { FilterType } from '@/features/table-filters/store/types'

// Per-column overrides of how a chosen filter/order value becomes an API
// query param, keyed by [filterType][optionName] -- same extension point as
// the reference project's customFilters/customOrders registries. When a
// column has no entry here, ColumnFilter.tsx falls back to sending the raw
// optionName=value pair; add an entry when a column needs a different query
// param name or a value transform before it's sent.
export const customFilters: Record<
  FilterType,
  {
    filters: {
      [optionName: string]: (value: string) => string
    }
  }
> = {
  payments: { filters: {} },
  payouts: { filters: {} },
}

export const customOrders: Record<
  FilterType,
  {
    filters: {
      [optionName: string]: (value: string) => string
    }
  }
> = {
  payments: { filters: {} },
  payouts: { filters: {} },
}
