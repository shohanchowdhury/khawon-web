import { useState, type FormEvent } from 'react'
import { submitRestaurantReview } from '@/api/client'
import { useAuth } from '@/context/AuthContext'
import { useAuthModal } from '@/context/AuthModalContext'

interface RestaurantReviewFormProps {
  restaurantId: number
  onSubmitted?: () => void
}

export default function RestaurantReviewForm({
  restaurantId,
  onSubmitted,
}: RestaurantReviewFormProps) {
  const { isAuthenticated } = useAuth()
  const { openAuthModal } = useAuthModal()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="review-form review-form--prompt">
        <h3>Review this restaurant</h3>
        <p className="muted">Sign in to share your overall experience.</p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openAuthModal('login')}
        >
          Sign in to review
        </button>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await submitRestaurantReview(restaurantId, {
        rating,
        comment: comment.trim() || undefined,
      })
      setRating(5)
      setComment('')
      onSubmitted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Review this restaurant</h3>

      <label>
        Rating
        <div className="rating-picker">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`rating-picker__star ${n <= rating ? 'rating-picker__star--active' : ''}`}
              onClick={() => setRating(n)}
              aria-label={`${n} stars`}
            >
              ★
            </button>
          ))}
        </div>
      </label>

      <label>
        Comment
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="How was your visit?"
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  )
}
