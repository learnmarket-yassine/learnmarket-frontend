import { DEFAULT_LEARN_REQUEST_FILTERS, LearnRequestFiltersValues } from '../schemas'
import { LearnRequestType, ProficiencyLevel } from '../store/types'

/**
 * URL encoding for the tutor browse feed: filters and page only -- search is
 * deliberately local-only and never appears here. Each filter field is its
 * own flat query key (e.g. ?type=COURSE&level=BEGINNER,ADVANCED&page=2)
 * rather than a single JSON blob, so the URL stays readable and shareable.
 */
export interface LearnRequestFeedParams {
  filters: LearnRequestFiltersValues
  page: number
}

const splitCsv = (value: string | null): string[] => (value ? value.split(',') : [])

export function parseLearnRequestFeedParams(searchParams: URLSearchParams): LearnRequestFeedParams {
  const budgetMin = searchParams.get('budgetMin')
  const budgetMax = searchParams.get('budgetMax')

  return {
    page: Math.max(0, Number(searchParams.get('page') ?? '0') || 0),
    filters: {
      ...DEFAULT_LEARN_REQUEST_FILTERS,
      categoryId: searchParams.get('categoryId') || undefined,
      type: splitCsv(searchParams.get('type')) as LearnRequestType[],
      level: splitCsv(searchParams.get('level')) as ProficiencyLevel[],
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      preferredLanguages: splitCsv(searchParams.get('preferredLanguages')),
      requestedFrequency: splitCsv(searchParams.get('requestedFrequency')).map(Number),
    },
  }
}

export function buildLearnRequestFeedParams({
  filters,
  page,
}: LearnRequestFeedParams): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.categoryId) params.set('categoryId', filters.categoryId)
  if (filters.type?.length) params.set('type', filters.type.join(','))
  if (filters.level?.length) params.set('level', filters.level.join(','))
  if (filters.budgetMin !== undefined) params.set('budgetMin', String(filters.budgetMin))
  if (filters.budgetMax !== undefined) params.set('budgetMax', String(filters.budgetMax))
  if (filters.preferredLanguages?.length) {
    params.set('preferredLanguages', filters.preferredLanguages.join(','))
  }
  if (filters.requestedFrequency?.length) {
    params.set('requestedFrequency', filters.requestedFrequency.join(','))
  }
  if (page > 0) params.set('page', String(page))
  return params
}
