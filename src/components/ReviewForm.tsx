import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { submitReview } from '@/api/client'
import { useAuth } from '@/context/AuthContext'

interface ReviewFormProps {
  restaurantId: number
  foodTypeId: number
  onSubmitted?: () => void
}

export default function ReviewForm({ restaurantId, foodTypeId, onSubmitted }: ReviewFormProps) {
  const { isAuthenticated } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="review-form review-form--prompt">
        <h3>Leave a review</h3>
        <p className="muted">Sign in to share your experience.</p>
        <Link to="/login" className="btn-primary">Sign in to review</Link>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await submitReview({
        restaurant_id: restaurantId,
        food_type_id: foodTypeId,
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
      <h3>Leave a review</h3>

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
          placeholder="Share your experience..."
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  )
}
