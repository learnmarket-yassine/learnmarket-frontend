export interface Specialty {
  id: string
  categoryId: string
  name: string
  slug?: string
  isActive?: boolean
}

export interface Category {
  id: string
  name: string
  slug?: string
  isActive?: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  hasMore: boolean
}
