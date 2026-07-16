import type { BrandDishOut } from '@/types/api'
import BrandDishCard from '@/components/BrandDishCard'
import PaginationControls from '@/components/PaginationControls'
import { brandDishKey } from '@/utils/brandLink'

interface BrandDishGridProps {
  dishes: BrandDishOut[]
  loading?: boolean
  error?: string
  emptyMessage?: string
  countLabel?: string
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
  resolveImage?: (
    dish: BrandDishOut,
    index: number,
  ) => { imageUrl: string | null; fallbackUrl: string | null }
}

export default function BrandDishGrid({
  dishes,
  loading = false,
  error = '',
  emptyMessage = 'No dishes found.',
  countLabel,
  page,
  pageSize,
  total,
  onPageChange,
  resolveImage,
}: BrandDishGridProps) {
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
      <div className="brand-dish-grid">
        {dishes.map((dish, index) => {
          const images = resolveImage?.(dish, index)
          return (
            <BrandDishCard
              key={brandDishKey(dish)}
              dish={dish}
              priority={index < 4}
              imageUrl={images?.imageUrl}
              fallbackUrl={images?.fallbackUrl}
            />
          )
        })}
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
