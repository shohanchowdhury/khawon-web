import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBrand } from '@/api/client'
import type { BrandDetailOut } from '@/types/api'
import FoodImage from '@/components/FoodImage'
import PageScroll from '@/components/PageScroll'
import StarRating from '@/components/StarRating'
import { buildRestaurantLink } from '@/utils/restaurantLink'

export default function BrandDetail() {
  const { chainId } = useParams<{ chainId: string }>()
  const [brand, setBrand] = useState<BrandDetailOut | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!chainId) {
      setLoading(false)
      setError('Missing brand id.')
      return
    }

    setLoading(true)
    setError('')

    getBrand(chainId)
      .then(setBrand)
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
        setBrand(null)
      })
      .finally(() => setLoading(false))
  }, [chainId])

  const heroImage = brand?.branches.find((branch) => branch.image_url)?.image_url ?? null

  return (
    <div className="page brand-detail-page">
      <PageScroll>
        <main className="page-content">
          <p className="brand-detail-page__back">
            <Link to="/restaurants" className="back-link">
              ← Back to restaurants
            </Link>
          </p>

          {loading && <p className="loading">Loading brand...</p>}

          {error && (
            <div className="error-box">
              <p>{error}</p>
            </div>
          )}

          {brand && (
            <>
              <header className="brand-detail-page__header">
                <div className="brand-detail-page__hero-media">
                  <FoodImage
                    name={brand.name}
                    imageUrl={heroImage}
                    className="brand-detail-page__hero-image"
                    priority
                  />
                </div>
                <div className="brand-detail-page__hero-copy">
                  <h1>{brand.name}</h1>
                  <p className="muted brand-detail-page__subtitle">
                    {brand.branch_count} location{brand.branch_count !== 1 ? 's' : ''}
                  </p>
                  {brand.display_rating != null && (
                    <StarRating rating={brand.display_rating} size="md" />
                  )}
                </div>
              </header>

              <section className="brand-detail-page__branches">
                <h2>Locations</h2>
                {brand.branches.length === 0 ? (
                  <p className="empty">No active branches listed.</p>
                ) : (
                  <ul className="brand-branch-list">
                    {brand.branches.map((branch) => (
                      <li key={branch.id} className="brand-branch-list__item">
                        <Link
                          to={buildRestaurantLink(branch.id)}
                          className="brand-branch-list__link"
                        >
                          <span className="brand-branch-list__name">{branch.name}</span>
                          {(branch.area || branch.address) && (
                            <span className="muted brand-branch-list__address">
                              {[branch.area, branch.address].filter(Boolean).join(' · ')}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </main>
      </PageScroll>
    </div>
  )
}
