import { useState, type FormEvent } from 'react'
import { submitReview } from '@/api/client'
import { useAuth } from '@/context/AuthContext'
import { useAuthModal } from '@/context/AuthModalContext'
import type { DishOut } from '@/types/api'

interface ReviewFormProps {
  dishes: DishOut[]
  onSubmitted?: () => void
}

export default function ReviewForm({ dishes, onSubmitted }: ReviewFormProps) {
  const { isAuthenticated } = useAuth()
  const { openAuthModal } = useAuthModal()
  const [dishId, setDishId] = useState<number | ''>('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="review-form review-form--prompt">
        <h3>Review a dish</h3>
        <p className="muted">Sign in to share your experience.</p>
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

  if (dishes.length === 0) {
    return null
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (dishId === '') {
      setError('Pick the dish you tried.')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      await submitReview({
        dish_id: dishId,
        rating,
        comment: comment.trim() || undefined,
      })
      setDishId('')
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
      <h3>Review a dish</h3>

      <label>
        Dish
        <select
          value={dishId}
          onChange={(e) => setDishId(e.target.value ? Number(e.target.value) : '')}
          required
        >
          <option value="">Which dish did you try?</option>
          {dishes.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.name}
              {dish.price_bdt != null ? ` — ${dish.price_bdt} tk` : ''}
            </option>
          ))}
        </select>
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
          placeholder="How was it?"
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  )
}
