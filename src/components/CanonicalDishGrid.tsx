import type { CanonicalDishMatch } from '@/types/api'
import CanonicalDishCard from '@/components/CanonicalDishCard'
import PaginationControls from '@/components/PaginationControls'

interface CanonicalDishGridProps {
  dishes: CanonicalDishMatch[]
  loading?: boolean
  error?: string
  emptyMessage?: string
  countLabel?: string
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
}

export default function CanonicalDishGrid({
  dishes,
  loading = false,
  error = '',
  emptyMessage = 'No dishes to compare yet.',
  countLabel,
  page,
  pageSize,
  total,
  onPageChange,
}: CanonicalDishGridProps) {
  if (loading) {
    return <p className="loading">Loading dishes...</p>
  }

  if (error) {
    return (
      <div className="error-box">
        <p>{error}</p>
      </div>
    )
  }

  if (dishes.length === 0) {
    return <p className="empty">{emptyMessage}</p>
  }

  return (
    <>
      {countLabel && <p className="catalogue-count muted">{countLabel}</p>}
      <div className="canonical-dish-grid">
        {dishes.map((match, index) => (
          <CanonicalDishCard key={match.id} match={match} priority={index < 4} />
        ))}
      </div>
      {page != null && pageSize != null && total != null && onPageChange && (
        <PaginationControls
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          loading={loading}
        />
      )}
    </>
  )
}
