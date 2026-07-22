import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getPaginationRange } from '../../utils/getPaginationRange'

type LearnRequestPaginationProps = {
  currentPage: number
  totalCount: number
  take: number
  onPageChange: (page: number) => void
}

const LearnRequestPagination = ({
  currentPage,
  totalCount,
  take,
  onPageChange,
}: LearnRequestPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / take))
  const range = getPaginationRange(currentPage, totalPages)
  const isFirstPage = currentPage <= 0
  const isLastPage = currentPage >= totalPages - 1

  return (
    <Pagination className="!mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (!isFirstPage) onPageChange(currentPage - 1)
            }}
            disabled={isFirstPage}
          />
        </PaginationItem>
        {range.map((item, index) =>
          item === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === currentPage + 1}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(item - 1)
                }}
                className="data-[active=true]:border-[#143681] data-[active=true]:bg-[#143681] data-[active=true]:text-white hover:data-[active=true]:bg-[#143681]"
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (!isLastPage) onPageChange(currentPage + 1)
            }}
            disabled={isLastPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default LearnRequestPagination
