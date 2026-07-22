import { describe, expect, it } from 'vitest'
import { getPaginationRange } from './getPaginationRange'

describe('getPaginationRange', () => {
  it('returns nothing for zero pages', () => {
    expect(getPaginationRange(0, 0)).toEqual([])
  })

  it('returns a single page indicator for one page', () => {
    expect(getPaginationRange(0, 1)).toEqual([1])
  })

  it('has no ellipsis when every page fits in the window', () => {
    expect(getPaginationRange(2, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('collapses the tail near the start: < 1 2 3 … 12 >', () => {
    // currentPage 1 (displayed 2) of 12
    expect(getPaginationRange(1, 12)).toEqual([1, 2, 3, 'ellipsis', 12])
  })

  it('collapses the head near the end: < 1 … 10 11 12 >', () => {
    // currentPage 10 (displayed 11) of 12 -- mirror of the start case
    expect(getPaginationRange(10, 12)).toEqual([1, 'ellipsis', 10, 11, 12])
  })

  it('collapses both sides in the middle: < 1 … 5 6 7 … 12 >', () => {
    // currentPage 5 (displayed 6) of 12
    expect(getPaginationRange(5, 12)).toEqual([1, 'ellipsis', 5, 6, 7, 'ellipsis', 12])
  })

  it('does not duplicate page 1 when the window already touches it', () => {
    // currentPage 0 (displayed 1) of 12 -- window clamps at the boundary
    expect(getPaginationRange(0, 12)).toEqual([1, 2, 'ellipsis', 12])
  })

  it('does not duplicate the last page when the window already touches it', () => {
    // currentPage 11 (displayed 12) of 12 -- window clamps at the boundary
    expect(getPaginationRange(11, 12)).toEqual([1, 'ellipsis', 11, 12])
  })
})
