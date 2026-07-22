export type PageRangeItem = number | 'ellipsis'

const SIBLING_COUNT = 1

export function getPaginationRange(currentPage: number, totalPages: number): PageRangeItem[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : []

  const currentDisplay = currentPage + 1
  const pages = new Set<number>([1, totalPages])
  for (let i = currentDisplay - SIBLING_COUNT; i <= currentDisplay + SIBLING_COUNT; i++) {
    if (i >= 1 && i <= totalPages) pages.add(i)
  }

  const sorted = Array.from(pages).sort((a, b) => a - b)
  const result: PageRangeItem[] = []
  let previous: number | null = null
  for (const page of sorted) {
    if (previous !== null && page - previous > 1) result.push('ellipsis')
    result.push(page)
    previous = page
  }
  return result
}
