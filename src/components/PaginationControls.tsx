interface PaginationControlsProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  loading?: boolean
  className?: string
}

function buildClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base
}

export default function PaginationControls({
  page,
  pageSize,
  total,
  onPageChange,
  loading = false,
  className,
}: PaginationControlsProps) {
  if (total <= pageSize) return null

  const pageCount = Math.ceil(total / pageSize)
  const start = page * pageSize + 1
  const end = Math.min((page + 1) * pageSize, total)

  return (
    <nav
      className={buildClassName('pagination-controls', className)}
      aria-label="Pagination"
    >
      <p className="pagination-controls__summary muted">
        Showing {start}–{end} of {total}
      </p>
      <div className="pagination-controls__actions">
        <button
          type="button"
          className="pagination-controls__btn"
          disabled={loading || page <= 0}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span className="pagination-controls__page muted">
          Page {page + 1} of {pageCount}
        </span>
        <button
          type="button"
          className="pagination-controls__btn"
          disabled={loading || page >= pageCount - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  )
}
