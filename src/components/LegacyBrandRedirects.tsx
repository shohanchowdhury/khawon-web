import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { resolveBranch } from '@/api/client'
import { buildBrandDishLink } from '@/utils/brandLink'

function useLegacyBranchSlug(branchId: string | undefined): string | null | 'loading' {
  const [slug, setSlug] = useState<string | null | 'loading'>('loading')

  useEffect(() => {
    if (!branchId) {
      setSlug(null)
      return
    }

    if (!/^\d+$/.test(branchId)) {
      setSlug(branchId)
      return
    }

    let cancelled = false
    resolveBranch(branchId)
      .then((branch) => {
        if (!cancelled) setSlug(branch.chain_slug)
      })
      .catch(() => {
        if (!cancelled) setSlug(null)
      })

    return () => {
      cancelled = true
    }
  }, [branchId])

  return slug
}

export function LegacyBrandRedirect() {
  const { chainId } = useParams<{ chainId: string }>()
  const slug = useLegacyBranchSlug(chainId)

  if (slug === 'loading') return null
  if (!slug) return <Navigate to="/restaurants" replace />
  return <Navigate to={`/restaurants/${encodeURIComponent(slug)}`} replace />
}

export function LegacyBrandDishRedirect() {
  const { chainId, foodTypeId, slug: dishSlug } = useParams<{
    chainId: string
    foodTypeId: string
    slug: string
  }>()
  const brandSlug = useLegacyBranchSlug(chainId)

  if (brandSlug === 'loading') return null
  if (!brandSlug || !foodTypeId || !dishSlug) {
    return <Navigate to="/restaurants" replace />
  }

  return (
    <Navigate
      to={buildBrandDishLink(brandSlug, Number(foodTypeId), dishSlug)}
      replace
    />
  )
}

export function LegacyRestaurantRedirect() {
  const { id } = useParams<{ id: string }>()
  const slug = useLegacyBranchSlug(id)

  if (slug === 'loading') return null
  if (!slug) return <Navigate to="/restaurants" replace />
  return <Navigate to={`/restaurants/${encodeURIComponent(slug)}`} replace />
}

export function LegacyRestaurantDishRedirect() {
  const { id, foodTypeId, slug: dishSlug } = useParams<{
    id: string
    foodTypeId: string
    slug: string
  }>()
  const brandSlug = useLegacyBranchSlug(id)

  if (brandSlug === 'loading') return null
  if (!brandSlug || !foodTypeId || !dishSlug) {
    return <Navigate to="/restaurants" replace />
  }

  return (
    <Navigate
      to={buildBrandDishLink(brandSlug, Number(foodTypeId), dishSlug)}
      replace
    />
  )
}
