import { useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getRestaurant, getRestaurantDishes, getRestaurantReviews } from '@/api/client'
import { useAuth } from '@/context/AuthContext'
import { useNavBarOverrides } from '@/context/NavBarContext'
import type { DishOut, RestaurantOut, RestaurantReviewOut } from '@/types/api'
import PageScroll from '@/components/PageScroll'
import RestaurantDetailHero from '@/components/RestaurantDetailHero'
import RestaurantMenuSection from '@/components/RestaurantMenuSection'
import RestaurantReviewForm from '@/components/RestaurantReviewForm'
import ReviewForm from '@/components/ReviewForm'
import StarRating from '@/components/StarRating'
import useScrolledPast from '@/hooks/useScrolledPast'

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const { setOverrides } = useNavBarOverrides()
  const [searchParams] = useSearchParams()
  const foodTypeId = Number(searchParams.get('foodTypeId'))
  const categoryParam = searchParams.get('category')?.trim() || ''
  const searchQuery = searchParams.get('q') || ''

  const [backAnchor, setBackAnchor] = useState<HTMLDivElement | null>(null)
  const [titleAnchor, setTitleAnchor] = useState<HTMLDivElement | null>(null)
  const [restaurant, setRestaurant] = useState<RestaurantOut | null>(null)
  const [dishes, setDishes] = useState<DishOut[]>([])
  const [reviews, setReviews] = useState<RestaurantReviewOut[]>([])
  const [loading, setLoading] = useState(true)
  const [menuLoading, setMenuLoading] = useState(true)
  const [error, setError] = useState('')

  const loadRestaurant = useCallback(() => {
    if (!id) return
    getRestaurant(id).then(setRestaurant).catch(() => setRestaurant(null))
  }, [id])

  const loadReviews = useCallback(() => {
    if (!id) return
    getRestaurantReviews(id)
      .then((result) => setReviews(result.reviews))
      .catch(() => setReviews([]))
  }, [id])

  useEffect(() => {
    if (!id) return

    setLoading(true)
    setMenuLoading(true)
    setError('')

    Promise.all([getRestaurant(id), getRestaurantReviews(id)])
      .then(([r, reviewResult]) => {
        setRestaurant(r)
        setReviews(reviewResult.reviews)
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))

    getRestaurantDishes(id)
      .then(setDishes)
      .catch(() => setDishes([]))
      .finally(() => setMenuLoading(false))
  }, [id])

  const activeFoodTypeId =
    foodTypeId ||
    restaurant?.food_types?.[0]?.id

  const categoryName =
    categoryParam ||
    (activeFoodTypeId
      ? restaurant?.food_types?.find((foodType) => foodType.id === activeFoodTypeId)?.name
      : undefined)

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
  const showNavContext = Boolean(restaurant && (backInNav || titleInNav))

  useEffect(() => {
    setOverrides({
      showContext: showNavContext,
      contextTitle: titleInNav ? restaurant?.name : undefined,
      contextBack:
        restaurant && (backInNav || titleInNav)
          ? { href: backHref, label: '←', ariaLabel: navBackAriaLabel }
          : undefined,
    })
  }, [
    backHref,
    backInNav,
    navBackAriaLabel,
    restaurant,
    setOverrides,
    showNavContext,
    titleInNav,
  ])

  function handleRestaurantReviewSubmitted() {
    loadReviews()
    loadRestaurant()
  }

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

          {restaurant && (
            <>
              <RestaurantDetailHero
                restaurant={restaurant}
                editHref={
                  isAuthenticated ? `/manage/restaurant/${restaurant.id}` : undefined
                }
                backHref={backHref}
                backLabel={backLabel}
                backInNav={backInNav}
                onBackAnchorRef={setBackAnchor}
                titleInNav={titleInNav}
                titleAnchorRef={setTitleAnchor}
              />

              <RestaurantMenuSection
                dishes={dishes}
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

                <RestaurantReviewForm
                  restaurantId={restaurant.id}
                  onSubmitted={handleRestaurantReviewSubmitted}
                />
              </section>

              <section className="reviews-section" id="dish-reviews">
                <ReviewForm dishes={dishes} />
              </section>
            </>
          )}
        </main>
      </PageScroll>
    </div>
  )
}
