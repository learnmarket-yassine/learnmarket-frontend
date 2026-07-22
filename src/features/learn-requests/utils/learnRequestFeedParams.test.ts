import { describe, expect, it } from 'vitest'
import { buildLearnRequestFeedParams, parseLearnRequestFeedParams } from './learnRequestFeedParams'

describe('parseLearnRequestFeedParams', () => {
  it('defaults to page 0 and empty-array filters when nothing is set', () => {
    const result = parseLearnRequestFeedParams(new URLSearchParams())
    expect(result.page).toBe(0)
    expect(result.filters.type).toEqual([])
    expect(result.filters.level).toEqual([])
    expect(result.filters.categoryId).toBeUndefined()
  })

  it('reads flat CSV keys, not a JSON blob', () => {
    const result = parseLearnRequestFeedParams(
      new URLSearchParams('type=COURSE,ONE_TIME&level=BEGINNER&page=3')
    )
    expect(result.page).toBe(3)
    expect(result.filters.type).toEqual(['COURSE', 'ONE_TIME'])
    expect(result.filters.level).toEqual(['BEGINNER'])
  })

  it('ignores a search param entirely -- search is not part of this contract', () => {
    const result = parseLearnRequestFeedParams(new URLSearchParams('search=python&page=2'))
    expect(result.page).toBe(2)
    expect(result).not.toHaveProperty('search')
  })
})

describe('buildLearnRequestFeedParams', () => {
  it('omits page when it is 0', () => {
    const params = buildLearnRequestFeedParams({ filters: {}, page: 0 })
    expect(params.has('page')).toBe(false)
  })

  it('round-trips filters and page through parse/build', () => {
    const original = parseLearnRequestFeedParams(
      new URLSearchParams('type=COURSE&budgetMin=10&budgetMax=50&page=4')
    )
    const rebuilt = buildLearnRequestFeedParams(original)
    const reparsed = parseLearnRequestFeedParams(rebuilt)
    expect(reparsed).toEqual(original)
  })

  it('never writes a search key', () => {
    const params = buildLearnRequestFeedParams({ filters: { type: ['COURSE'] }, page: 1 })
    expect(params.has('search')).toBe(false)
  })
})
