import { OptionConfig } from '@/components/ui/ColumnFilter/ColumnOptions/types'

// Static per-column "radio" option lists, keyed by [filterType][optionName] --
// same role as the reference project's src/lib/Constants.ts FILTER_OPTIONS.
// Both ColumnOptions (the picker) and TableHead (the active-filter chip label)
// read from this single source, so a column's options are declared once.
export const FILTER_OPTIONS: OptionConfig = {
  payments: {
    status: [
      { id: 0, name: 'Pending', value: 'PENDING' },
      { id: 1, name: 'Succeeded', value: 'SUCCEEDED' },
      { id: 2, name: 'Failed', value: 'FAILED' },
      { id: 3, name: 'Refunded', value: 'REFUNDED' },
      { id: 4, name: 'Partially refunded', value: 'PARTIALLY_REFUNDED' },
    ],
  },
  payouts: {
    status: [
      { id: 0, name: 'Paid out', value: 'RELEASED' },
      { id: 1, name: 'Processing', value: 'PENDING' },
      { id: 2, name: 'Processing (onboarding)', value: 'PENDING_ONBOARDING' },
      { id: 3, name: 'Under review', value: 'HELD_FOR_REVIEW' },
      { id: 4, name: 'Cancelled', value: 'CANCELLED' },
      { id: 5, name: 'Failed', value: 'FAILED' },
    ],
  },
}
