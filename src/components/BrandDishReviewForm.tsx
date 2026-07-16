import { useState, type FormEvent } from 'react'
import { submitReview } from '@/api/client'
import { useAuth } from '@/context/AuthContext'
import { useAuthModal } from '@/context/AuthModalContext'
import type { BrandBranchOut } from '@/types/api'
import { formatPriceBdt } from '@/utils/formatPriceBdt'

interface BrandDishReviewFormProps {
  branches: BrandBranchOut[]
  dishName: string
  onSubmitted?: () => void
}

export default function BrandDishReviewForm({
  branches,
  dishName,
  onSubmitted,
}: BrandDishReviewFormProps) {
  const { isAuthenticated } = useAuth()
  const { openAuthModal } = useAuthModal()
  const [productId, setProductId] = useState<number | ''>('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="review-form review-form--prompt">
        <h3>Review {dishName}</h3>
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

  if (branches.length === 0) {
    return null
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (productId === '') {
      setError('Pick the branch where you tried it.')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      await submitReview({
        dish_id: productId,
        rating,
        comment: comment.trim() || undefined,
      })
      setProductId('')
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
      <h3>Review {dishName}</h3>
      <p className="muted review-form__hint">
        Reviews are tied to the branch you visited.
      </p>

      <label>
        Branch
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : '')}
          required
        >
          <option value="">Which branch did you visit?</option>
          {branches.map((branch) => (
            <option key={branch.product_id} value={branch.product_id}>
              {branch.restaurant_name}
              {branch.area ? ` (${branch.area})` : ''}
              {formatPriceBdt(branch.price_bdt) ? ` — ${formatPriceBdt(branch.price_bdt)}` : ''}
              {branch.is_sold_out ? ' — sold out' : ''}
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
