import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getFoodDetail } from '@/api/client'
import { useAuth } from '@/context/AuthContext'
import { useNavBarOverrides } from '@/context/NavBarContext'
import type { FoodDetailResult } from '@/types/api'
import FoodDetailHero from '@/components/FoodDetailHero'
import FoodRestaurantSection from '@/components/FoodRestaurantSection'
import PageScroll from '@/components/PageScroll'
import useScrolledPast from '@/hooks/useScrolledPast'

const SLOW_LOAD_MS = 8000

export default function FoodDetail() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { setOverrides } = useNavBarOverrides()
  const [backAnchor, setBackAnchor] = useState<HTMLDivElement | null>(null)
  const [titleAnchor, setTitleAnchor] = useState<HTMLDivElement | null>(null)
  const searchQuery =
    location.state && typeof location.state === 'object' && 'fromSearch' in location.state
      ? String((location.state as { fromSearch?: string }).fromSearch ?? '')
      : ''

  const [detail, setDetail] = useState<FoodDetailResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [slowLoading, setSlowLoading] = useState(false)
  const [error, setError] = useState('')

  const backInNav = useScrolledPast(backAnchor)
  const titleInNav = useScrolledPast(titleAnchor)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setSlowLoading(false)
      setError('Missing food id.')
      return
    }

    let cancelled = false
    const slowTimer = window.setTimeout(() => {
      if (!cancelled) {
        setSlowLoading(true)
      }
    }, SLOW_LOAD_MS)

    setLoading(true)
    setSlowLoading(false)
    setError('')
    setDetail(null)

    getFoodDetail(id)
      .then((data) => {
        if (!cancelled) {
          setDetail(data)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
          setSlowLoading(false)
        }
        window.clearTimeout(slowTimer)
      })

    return () => {
      cancelled = true
      window.clearTimeout(slowTimer)
    }
  }, [id])

  const backHref = searchQuery
      ? `/foods?q=${encodeURIComponent(searchQuery)}`
    : '/foods'
  const backLabel = searchQuery ? '← Back to search results' : '← Back to foods'
  const navBackAriaLabel = searchQuery ? 'Back to search results' : 'Back to foods'
  const showNavContext = Boolean(detail && (backInNav || titleInNav))

  useEffect(() => {
    setOverrides({
      showContext: showNavContext,
      contextTitle: titleInNav ? detail?.food_type.name : undefined,
      contextBack:
        detail && (backInNav || titleInNav)
          ? { href: backHref, label: '←', ariaLabel: navBackAriaLabel }
          : undefined,
    })
  }, [
    backHref,
    backInNav,
    detail,
    navBackAriaLabel,
    setOverrides,
    showNavContext,
    titleInNav,
  ])

  return (
    <div className="page food-detail-page">
      <PageScroll>
          <main className="page-content">
            {loading && (
              <>
                <Link to={backHref} className="back-link page-back-link">
                  {backLabel}
                </Link>
                <p className="loading">Loading...</p>
                {slowLoading && (
                  <p className="muted">Still loading restaurants for this food type...</p>
                )}
              </>
            )}

            {error && (
              <>
                <Link to={backHref} className="back-link page-back-link">
                  {backLabel}
                </Link>
                <div className="error-box">
                  <p>{error}</p>
                </div>
              </>
            )}

            {detail && (
              <>
                <FoodDetailHero
                  food={detail.food_type}
                  editHref={isAuthenticated ? `/manage/food/${detail.food_type.id}` : undefined}
                  backHref={backHref}
                  backLabel={backLabel}
                  backInNav={backInNav}
                  onBackAnchorRef={setBackAnchor}
                  titleInNav={titleInNav}
                  titleAnchorRef={setTitleAnchor}
                />
                <FoodRestaurantSection
                  food={detail.food_type}
                  restaurants={detail.restaurants}
                  searchQuery={searchQuery || undefined}
                />
              </>
            )}
          </main>
      </PageScroll>
    </div>
  )
}
