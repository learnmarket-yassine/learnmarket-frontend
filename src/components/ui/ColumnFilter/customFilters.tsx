import { FilterType } from '@/features/table-filters/store/types'
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
  sparks: { filters: {} },
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
  sparks: { filters: {} },
}
