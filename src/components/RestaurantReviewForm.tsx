import { useState, type FormEvent } from 'react'
import { submitRestaurantReview } from '@/api/client'
import { useAuth } from '@/context/AuthContext'
import { useAuthModal } from '@/context/AuthModalContext'
import type { RestaurantSummaryOut } from '@/types/api'
import { getBranchLocationLabel } from '@/utils/brandLink'

interface RestaurantReviewFormProps {
  brandSlug: string
  branches: RestaurantSummaryOut[]
  brandName?: string
  onSubmitted?: () => void
}

export default function RestaurantReviewForm({
  brandSlug,
  branches,
  brandName,
  onSubmitted,
}: RestaurantReviewFormProps) {
  const { isAuthenticated } = useAuth()
  const { openAuthModal } = useAuthModal()
  const [branchId, setBranchId] = useState<number | ''>(() =>
    branches.length === 1 && branches[0] != null ? branches[0].id : '',
  )
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

  if (branches.length === 0) {
    return null
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (branchId === '') {
      setError('Pick the location you visited.')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      await submitRestaurantReview(brandSlug, {
        branch_id: branchId,
        rating,
        comment: comment.trim() || undefined,
      })
      setBranchId(branches.length === 1 && branches[0] != null ? branches[0].id : '')
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
      {branches.length > 1 && (
        <p className="muted review-form__hint">
          Reviews are tied to the location you visited.
        </p>
      )}

      {branches.length > 1 && (
        <label>
          Location
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value ? Number(e.target.value) : '')}
            required
          >
            <option value="">Which location did you visit?</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {getBranchLocationLabel(
                  { area: branch.area, restaurant_name: branch.name },
                  brandName,
                )}
              </option>
            ))}
          </select>
        </label>
      )}

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
