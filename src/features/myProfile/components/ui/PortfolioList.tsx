import { useState } from 'react'
import { ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react'
import { TutorProfile } from '../../store/types'
import PortfolioItemCard from './PortfolioItemCard'
import EmptyState from './EmptyState'

interface PortfolioListProps {
  portfolio: TutorProfile['portfolio']
  readOnly?: boolean
}

const PAGE_SIZE = 6

function PortfolioList({ portfolio, readOnly = false }: PortfolioListProps) {
  const [page, setPage] = useState(1)

  if (portfolio.length === 0) {
    return <EmptyState icon={FolderOpen} message="No portfolio projects added yet." />
  }

  const totalPages = Math.ceil(portfolio.length / PAGE_SIZE)
  const currentPage = Math.min(page, totalPages)
  const visibleItems = portfolio.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {visibleItems.map((item) => (
          <PortfolioItemCard key={item.id} item={item} readOnly={readOnly} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-8 w-8 items-center justify-center text-[#143681] disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              aria-label={`Page ${pageNumber}`}
              onClick={() => setPage(pageNumber)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold ${
                pageNumber === currentPage
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#143681] hover:bg-[#F5F6F7]'
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-8 w-8 items-center justify-center text-[#143681] disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  )
}
export default PortfolioList
