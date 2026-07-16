import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { compareDish } from '@/api/client'
import type { BrandDishOut } from '@/types/api'
import DishCompareRow from '@/components/DishCompareRow'
import PageScroll from '@/components/PageScroll'
import PaginationControls from '@/components/PaginationControls'
import StarRating from '@/components/StarRating'
import { brandDishKey } from '@/utils/brandLink'
import { resolveBrandDishCardImages } from '@/utils/productImageUrl'

const COMPARE_PAGE_SIZE = 20

function formatPriceRange(
  min: number | null | undefined,
  max: number | null | undefined,
): string | null {
  if (min == null) return null
  if (max == null || max === min) return `${min} tk`
  return `${min}–${max} tk`
}

export default function DishCompare() {
  const { canonicalDishId } = useParams<{ canonicalDishId: string }>()
  const [dishes, setDishes] = useState<BrandDishOut[]>([])
  const [dishName, setDishName] = useState('')
  const [foodTypeName, setFoodTypeName] = useState<string | null>(null)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [priceMin, setPriceMin] = useState<number | null>(null)
  const [priceMax, setPriceMax] = useState<number | null>(null)
  const [totalBrands, setTotalBrands] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setPage(0)
  }, [canonicalDishId])

  useEffect(() => {
    if (!canonicalDishId) {
      setLoading(false)
      setError('Missing dish id.')
      return
    }

    setLoading(true)
    setError('')

    compareDish(canonicalDishId, {
      offset: page * COMPARE_PAGE_SIZE,
      limit: COMPARE_PAGE_SIZE,
    })
      .then((result) => {
        setDishName(result.canonical_dish.name)
        setFoodTypeName(result.canonical_dish.food_type?.name ?? null)
        setDishes(result.dishes)
        setTotalBrands(result.total)
        setAverageRating(result.average_rating)
        setPriceMin(result.min_price_bdt)
        setPriceMax(result.max_price_bdt)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
        setDishes([])
        setTotalBrands(0)
      })
      .finally(() => setLoading(false))
  }, [canonicalDishId, page])

  const priceRange = formatPriceRange(priceMin, priceMax)
  const foodsBackHref = foodTypeName
    ? `/foods?category=${encodeURIComponent(foodTypeName)}`
    : '/foods'

  const compareCardImages = useMemo(() => {
    const seenProductUrls = new Set<string>()
    return dishes.map((dish) => resolveBrandDishCardImages(dish, seenProductUrls))
  }, [dishes])

  return (
    <div className="page dish-compare-page">
      <PageScroll>
        <main className="page-content">
          <p className="dish-compare-page__back">
            <Link to={foodsBackHref} className="back-link">
              {foodTypeName ? `← Back to ${foodTypeName}` : '← Back to foods'}
            </Link>
          </p>

          {loading && <p className="loading">Loading comparison...</p>}

          {error && (
            <div className="error-box">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <header className="dish-compare-page__header">
                <div>
                  <h1>{dishName}</h1>
                  <p className="muted dish-compare-page__subtitle">
                    {totalBrands} brand{totalBrands !== 1 ? 's' : ''}
                    {priceRange ? ` · ${priceRange}` : ''}
                    {foodTypeName ? ` · ${foodTypeName}` : ''}
                  </p>
                </div>
                {averageRating != null && (
                  <StarRating rating={averageRating} size="md" />
                )}
              </header>

              {totalBrands === 0 ? (
                <p className="empty">No brand variants found for this dish.</p>
              ) : (
                <>
                  <ul className="dish-compare-list">
                    {dishes.map((dish, index) => (
                      <DishCompareRow
                        key={brandDishKey(dish)}
                        dish={dish}
                        priority={index < 4}
                        imageUrl={compareCardImages[index]?.imageUrl}
                        fallbackUrl={compareCardImages[index]?.fallbackUrl}
                      />
                    ))}
                  </ul>
                  <PaginationControls
                    page={page}
                    pageSize={COMPARE_PAGE_SIZE}
                    total={totalBrands}
                    onPageChange={setPage}
                    loading={loading}
                  />
                </>
              )}
            </>
          )}
        </main>
      </PageScroll>
    </div>
  )
}
