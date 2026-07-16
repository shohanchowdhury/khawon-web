import { useEffect, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import {
  getRestaurant,
  getRestaurantMenu,
  getRestaurantReviews,
  resolveBranch,
} from '@/api/client'
import type { BrandDetailOut, BrandDishOut, RestaurantReviewOut } from '@/types/api'
import BrandMenuSection from '@/components/BrandMenuSection'
import PageScroll from '@/components/PageScroll'
import RestaurantDetailHero from '@/components/RestaurantDetailHero'
import RestaurantReviewForm from '@/components/RestaurantReviewForm'
import StarRating from '@/components/StarRating'
import useScrolledPast from '@/hooks/useScrolledPast'
import { useNavBarOverrides } from '@/context/NavBarContext'

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { setOverrides } = useNavBarOverrides()
  const foodTypeId = Number(searchParams.get('foodTypeId'))
  const categoryParam = searchParams.get('category')?.trim() || ''
  const searchQuery = searchParams.get('q') || ''

  const [redirectChainId, setRedirectChainId] = useState<number | null>(null)
  const [backAnchor, setBackAnchor] = useState<HTMLDivElement | null>(null)
  const [titleAnchor, setTitleAnchor] = useState<HTMLDivElement | null>(null)
  const [brand, setBrand] = useState<BrandDetailOut | null>(null)
  const [dishes, setDishes] = useState<BrandDishOut[]>([])
  const [reviews, setReviews] = useState<RestaurantReviewOut[]>([])
  const [reviewTotal, setReviewTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [menuLoading, setMenuLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError('Missing restaurant id.')
      return
    }

    const restaurantId = id
    let cancelled = false

    async function resolveAndLoad() {
      setLoading(true)
      setMenuLoading(true)
      setError('')
      setRedirectChainId(null)

      try {
        const [detail, reviewResult] = await Promise.all([
          getRestaurant(restaurantId),
          getRestaurantReviews(restaurantId),
        ])
        if (cancelled) return
        setBrand(detail)
        setReviews(reviewResult.reviews)
        setReviewTotal(reviewResult.total)
        setLoading(false)

        getRestaurantMenu(restaurantId)
          .then((menu) => {
            if (!cancelled) setDishes(menu)
          })
          .catch(() => {
            if (!cancelled) setDishes([])
          })
          .finally(() => {
            if (!cancelled) setMenuLoading(false)
          })
        return
      } catch {
        // Not a chain id — try old branch URL redirect.
      }

      try {
        const branch = await resolveBranch(restaurantId)
        if (!cancelled) {
          setRedirectChainId(branch.chain_id)
        }
      } catch {
        if (!cancelled) {
          setError('Restaurant not found.')
          setLoading(false)
          setMenuLoading(false)
        }
      }
    }

    void resolveAndLoad()

    return () => {
      cancelled = true
    }
  }, [id])

  const categoryName = categoryParam || undefined

  const backHref = categoryName
    ? `/foods?category=${encodeURIComponent(categoryName)}`
    : searchQuery
      ? `/search?q=${encodeURIComponent(searchQuery)}`
      : '/restaurants'

  const backLabel = categoryName
    ? `← Back to ${categoryName}`
    : searchQuery
      ? '← Back to search results'
      : '← Back to restaurants'

  const navBackAriaLabel = categoryName
    ? `Back to ${categoryName}`
    : searchQuery
      ? 'Back to search results'
      : 'Back to restaurants'

  const backInNav = useScrolledPast(backAnchor)
  const titleInNav = useScrolledPast(titleAnchor)
  const showNavContext = Boolean(brand && (backInNav || titleInNav))

  useEffect(() => {
    setOverrides({
      showContext: showNavContext,
      contextTitle: titleInNav ? brand?.name : undefined,
      contextBack:
        brand && (backInNav || titleInNav)
          ? { href: backHref, label: '←', ariaLabel: navBackAriaLabel }
          : undefined,
    })
  }, [
    backHref,
    backInNav,
    navBackAriaLabel,
    brand,
    setOverrides,
    showNavContext,
    titleInNav,
  ])

  function handleRestaurantReviewSubmitted() {
    if (!brand) return
    getRestaurantReviews(brand.id)
      .then((result) => {
        setReviews(result.reviews)
        setReviewTotal(result.total)
      })
      .catch(() => undefined)
    getRestaurant(brand.id).then(setBrand).catch(() => undefined)
  }

  if (redirectChainId != null) {
    return <Navigate to={`/restaurant/${redirectChainId}`} replace />
  }

  const heroImageUrl =
    brand?.branches.find((branch) => branch.image_url)?.image_url ?? null

  return (
    <div className="page restaurant-detail-page">
      <PageScroll>
        <main className="page-content">
          {loading && <p className="loading">Loading...</p>}
          {error && (
            <div className="error-box">
              <p>{error}</p>
            </div>
          )}

          {brand && (
            <>
              <RestaurantDetailHero
                brand={brand}
                heroImageUrl={heroImageUrl}
                reviewCount={reviewTotal}
                backHref={backHref}
                backLabel={backLabel}
                backInNav={backInNav}
                onBackAnchorRef={setBackAnchor}
                titleInNav={titleInNav}
                titleAnchorRef={setTitleAnchor}
              />

              <BrandMenuSection
                dishes={dishes}
                chainId={brand.id}
                loading={menuLoading}
                initialFoodTypeId={Number.isFinite(foodTypeId) ? foodTypeId : undefined}
              />

              <section className="reviews-section" id="restaurant-reviews">
                <h2>Restaurant reviews</h2>
                {reviews.length === 0 ? (
                  <p className="muted">No reviews yet. Be the first!</p>
                ) : (
                  <ul className="review-list">
                    {reviews.map((review) => (
                      <li key={review.id} className="review-item">
                        <div className="review-item__header">
                          <div>
                            {(review.branch_area || review.branch_name) && (
                              <span className="review-item__branch muted">
                                {review.branch_area || review.branch_name}
                                {' · '}
                              </span>
                            )}
                            <strong>{review.username}</strong>
                          </div>
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

                <RestaurantReviewForm
                  chainId={brand.id}
                  branches={brand.branches}
                  brandName={brand.name}
                  onSubmitted={handleRestaurantReviewSubmitted}
                />
              </section>
            </>
          )}
        </main>
      </PageScroll>
    </div>
  )
}
