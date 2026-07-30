import { StateCreator } from 'zustand'
import { TableFiltersSlice } from './types'

export const tableFiltersSlice: StateCreator<TableFiltersSlice> = (set) => ({
  tableFilters: {
    filters: {
      payments: [],
      payouts: [],
      sparks: [],
    },
    setTableFilters: (filterType, filters) =>
      set((state) => ({
        tableFilters: {
          ...state.tableFilters,
          filters: {
            ...state.tableFilters.filters,
            [filterType]: filters,
          },
        },
      })),
  },
})
