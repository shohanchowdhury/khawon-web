import { Navigate, useParams } from 'react-router-dom'

export function LegacyBrandRedirect() {
  const { chainId } = useParams<{ chainId: string }>()
  if (!chainId) return <Navigate to="/restaurants" replace />
  return <Navigate to={`/restaurant/${chainId}`} replace />
}

export function LegacyBrandDishRedirect() {
  const { chainId, foodTypeId, slug } = useParams<{
    chainId: string
    foodTypeId: string
    slug: string
  }>()
  if (!chainId || !foodTypeId || !slug) return <Navigate to="/restaurants" replace />
  return (
    <Navigate
      to={`/restaurant/${chainId}/dishes/${foodTypeId}/${slug}`}
      replace
    />
  )
}
