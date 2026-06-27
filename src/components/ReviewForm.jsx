import { useState } from 'react'
import { submitReview } from '../api/client'

export default function ReviewForm({ restaurantId, foodTypeId, onSubmitted }) {
  const [reviewerName, setReviewerName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await submitReview({
        restaurant_id: restaurantId,
        food_type_id: foodTypeId,
        reviewer_name: reviewerName.trim() || 'Anonymous',
        rating,
        comment: comment.trim() || null,
      })
      setReviewerName('')
      setRating(5)
      setComment('')
      onSubmitted?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Leave a review</h3>

      <label>
        Your name
        <input
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="Anonymous"
        />
      </label>

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
