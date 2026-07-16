import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBrandDish, getDishReviews } from '@/api/client'
import type { BrandDishDetailOut, ReviewOut } from '@/types/api'
import BrandBranchLocationBadges from '@/components/BrandBranchLocationBadges'
import BrandDishReviewForm from '@/components/BrandDishReviewForm'
import FoodImage from '@/components/FoodImage'
import PageScroll from '@/components/PageScroll'
import StarRating from '@/components/StarRating'
import { buildBrandLink } from '@/utils/brandLink'
import {
  formatBranchAvailability,
  getBrandDishDisplayPrice,
} from '@/utils/formatPriceBdt'

export default function BrandDishDetail() {
  const { chainId, foodTypeId, slug } = useParams<{
    chainId: string
    foodTypeId: string
    slug: string
  }>()
  const [dish, setDish] = useState<BrandDishDetailOut | null>(null)
  const [reviews, setReviews] = useState<ReviewOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadReviews = useCallback(
    (detail: BrandDishDetailOut) => {
      const productIds = detail.branches.map((branch) => branch.product_id)
      if (productIds.length === 0) {
        setReviews([])
        return
      }

      Promise.all(productIds.map((id) => getDishReviews(id, { limit: 20 })))
        .then((results) => {
          const merged = results
            .flatMap((result) => result.reviews)
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            )
          setReviews(merged)
        })
        .catch(() => setReviews([]))
    },
    [],
  )

  useEffect(() => {
    if (!chainId || !foodTypeId || !slug) {
      setLoading(false)
      setError('Missing dish reference.')
      return
    }

    setLoading(true)
    setError('')

    getBrandDish(chainId, foodTypeId, slug)
      .then((detail) => {
        setDish(detail)
        loadReviews(detail)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
        setDish(null)
        setReviews([])
      })
      .finally(() => setLoading(false))
  }, [chainId, foodTypeId, slug, loadReviews])

  function handleReviewSubmitted() {
    if (dish) loadReviews(dish)
  }

  const price = dish ? getBrandDishDisplayPrice(dish) : null
  const availability =
    dish != null
      ? formatBranchAvailability(dish.branch_count, dish.brand_branch_total)
      : null

  const backHref = dish ? buildBrandLink(dish.brand.id) : '/foods'
  const backLabel = dish ? `← Back to ${dish.brand.name}` : '← Back to foods'

  return (
    <div className="page brand-dish-detail-page">
      <PageScroll>
        <main className="page-content">
          <p className="brand-dish-detail-page__back">
            <Link to={backHref} className="back-link">
              {backLabel}
            </Link>
          </p>

          {loading && <p className="loading">Loading dish...</p>}

          {error && (
            <div className="error-box">
              <p>{error}</p>
            </div>
          )}

          {dish && (
            <>
              <header className="brand-dish-detail-page__header">
                <div className="brand-dish-detail-page__media">
                  <FoodImage
                    name={dish.name}
                    imageUrl={dish.image_url}
                    className="brand-dish-detail-page__image"
                    priority
                  />
                </div>
                <div className="brand-dish-detail-page__copy">
                  <p className="brand-dish-detail-page__brand">{dish.brand.name}</p>
                  <h1>{dish.name}</h1>
                  {dish.food_type && (
                    <p className="muted brand-dish-detail-page__type">
                      {dish.food_type.name}
                    </p>
                  )}
                  <div className="brand-dish-detail-page__meta">
                    {price && (
                      <span className="brand-dish-detail-page__price">
                        {price.prefix && (
                          <span className="brand-dish-detail-page__price-prefix">
                            {price.prefix}{' '}
                          </span>
                        )}
                        {price.text}
                      </span>
                    )}
                    {availability && (
                      <span className="muted brand-dish-detail-page__availability">
                        {availability}
                      </span>
                    )}
                    {dish.average_rating != null ? (
                      <StarRating rating={dish.average_rating} size="md" />
                    ) : (
                      <span className="muted">No reviews yet</span>
                    )}
                  </div>
                  {dish.branches.length > 0 && (
                    <BrandBranchLocationBadges
                      branches={dish.branches}
                      brandName={dish.brand.name}
                      showPrice={dish.price_varies}
                    />
                  )}
                  {dish.description && (
                    <p className="brand-dish-detail-page__description">{dish.description}</p>
                  )}
                </div>
              </header>

              <section className="reviews-section" id="brand-dish-reviews">
                <h2>Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="muted">No reviews yet. Be the first!</p>
                ) : (
                  <ul className="review-list">
                    {reviews.map((review) => (
                      <li key={review.id} className="review-item">
                        <div className="review-item__header">
                          <strong>{review.username}</strong>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        {review.comment && <p>{review.comment}</p>}
                        <time className="muted">
                          {new Date(review.created_at).toLocaleDateString()}
                        </time>
                      </li>
                    ))}
                  </ul>
                )}

                <BrandDishReviewForm
                  branches={dish.branches}
                  dishName={dish.name}
                  onSubmitted={handleReviewSubmitted}
                />
              </section>
            </>
          )}
        </main>
      </PageScroll>
    </div>
  )
}
