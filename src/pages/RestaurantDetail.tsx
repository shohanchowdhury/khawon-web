import { useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getRestaurant, getRestaurantDishes, getRestaurantReviews } from '@/api/client'
import { useAuth } from '@/context/AuthContext'
import { useNavBarOverrides } from '@/context/NavBarContext'
import type { DishOut, RestaurantOut, ReviewOut } from '@/types/api'
import PageScroll from '@/components/PageScroll'
import RestaurantDetailHero from '@/components/RestaurantDetailHero'
import RestaurantMenuSection from '@/components/RestaurantMenuSection'
import ReviewForm from '@/components/ReviewForm'
import StarRating from '@/components/StarRating'
import useScrolledPast from '@/hooks/useScrolledPast'

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const { setOverrides } = useNavBarOverrides()
  const [searchParams] = useSearchParams()
  const foodTypeId = Number(searchParams.get('foodTypeId'))
  const searchQuery = searchParams.get('q') || ''

  const [backAnchor, setBackAnchor] = useState<HTMLDivElement | null>(null)
  const [titleAnchor, setTitleAnchor] = useState<HTMLDivElement | null>(null)
  const [restaurant, setRestaurant] = useState<RestaurantOut | null>(null)
  const [dishes, setDishes] = useState<DishOut[]>([])
  const [reviews, setReviews] = useState<ReviewOut[]>([])
  const [loading, setLoading] = useState(true)
  const [menuLoading, setMenuLoading] = useState(true)
  const [error, setError] = useState('')

  const loadReviews = useCallback(() => {
    if (!id) return
    getRestaurantReviews(id).then(setReviews).catch(() => setReviews([]))
  }, [id])

  useEffect(() => {
    if (!id) return

    setLoading(true)
    setMenuLoading(true)
    setError('')

    Promise.all([getRestaurant(id), getRestaurantReviews(id)])
      .then(([r, revs]) => {
        setRestaurant(r)
        setReviews(revs)
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

  const backHref = activeFoodTypeId
    ? `/food/${activeFoodTypeId}`
    : searchQuery
      ? `/search?q=${encodeURIComponent(searchQuery)}`
      : '/restaurants'

  const backLabel = activeFoodTypeId
    ? '← Back to food'
    : searchQuery
      ? '← Back to search results'
      : '← Back to restaurants'

  const navBackAriaLabel = activeFoodTypeId
    ? 'Back to food'
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

              <RestaurantMenuSection dishes={dishes} loading={menuLoading} />

              <section className="reviews-section" id="restaurant-reviews">
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
                        {review.dish_name && (
                          <p className="muted">on {review.dish_name}</p>
                        )}
                        {review.comment && <p>{review.comment}</p>}
                        <time className="muted">
                          {new Date(review.created_at).toLocaleDateString()}
                        </time>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <ReviewForm
                dishes={dishes}
                onSubmitted={() => {
                  loadReviews()
                  if (id) getRestaurant(id).then(setRestaurant)
                }}
              />
            </>
          )}
        </main>
      </PageScroll>
    </div>
  )
}
