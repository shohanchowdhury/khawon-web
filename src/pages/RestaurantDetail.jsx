import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getRestaurant, getRestaurantReviews } from '../api/client'
import ReviewForm from '../components/ReviewForm'
import StarRating from '../components/StarRating'

export default function RestaurantDetail() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const foodTypeId = Number(searchParams.get('foodTypeId'))
  const searchQuery = searchParams.get('q') || ''

  const [restaurant, setRestaurant] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadReviews = useCallback(() => {
    getRestaurantReviews(id).then(setReviews).catch(() => setReviews([]))
  }, [id])

  useEffect(() => {
    setLoading(true)
    setError('')

    Promise.all([getRestaurant(id), getRestaurantReviews(id)])
      .then(([r, revs]) => {
        setRestaurant(r)
        setReviews(revs)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const activeFoodTypeId =
    foodTypeId ||
    restaurant?.food_types?.[0]?.id

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/" className="logo-link">খাওন</Link>
        {searchQuery && (
          <Link to={`/search?q=${encodeURIComponent(searchQuery)}`} className="back-link">
            ← Back to results
          </Link>
        )}
      </header>

      <main className="page-content page-content--narrow">
        {loading && <p className="loading">Loading...</p>}
        {error && <div className="error-box"><p>{error}</p></div>}

        {restaurant && (
          <>
            <section className="detail-header">
              <h1>{restaurant.name}</h1>
              {restaurant.area && <span className="badge badge--large">{restaurant.area}</span>}
              <div className="detail-meta">
                <StarRating rating={restaurant.average_rating} size="lg" />
                <span className="review-count">
                  {restaurant.review_count} review{restaurant.review_count !== 1 ? 's' : ''}
                </span>
              </div>
            </section>

            <section className="detail-info">
              {restaurant.address && <p><strong>Address:</strong> {restaurant.address}</p>}
              {restaurant.phone && <p><strong>Phone:</strong> {restaurant.phone}</p>}
              {restaurant.google_maps_url && (
                <p>
                  <a href={restaurant.google_maps_url} target="_blank" rel="noreferrer">
                    View on Google Maps
                  </a>
                </p>
              )}
              {restaurant.food_types?.length > 0 && (
                <div className="food-type-tags">
                  {restaurant.food_types.map((ft) => (
                    <span key={ft.id} className="tag">{ft.name}</span>
                  ))}
                </div>
              )}
            </section>

            <section className="reviews-section">
              <h2>Reviews</h2>
              {reviews.length === 0 ? (
                <p className="muted">No reviews yet. Be the first!</p>
              ) : (
                <ul className="review-list">
                  {reviews.map((review) => (
                    <li key={review.id} className="review-item">
                      <div className="review-item__header">
                        <strong>{review.reviewer_name || 'Anonymous'}</strong>
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
            </section>

            {activeFoodTypeId && (
              <ReviewForm
                restaurantId={restaurant.id}
                foodTypeId={activeFoodTypeId}
                onSubmitted={() => {
                  loadReviews()
                  getRestaurant(id).then(setRestaurant)
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
