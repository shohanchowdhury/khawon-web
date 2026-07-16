import { Link } from 'react-router-dom'
import type { BrandBranchOut } from '@/types/api'
import { getBranchLocationLabel } from '@/utils/brandLink'
import { formatPriceBdt } from '@/utils/formatPriceBdt'
import { buildRestaurantLink } from '@/utils/restaurantLink'

interface BrandBranchLocationBadgesProps {
  branches: BrandBranchOut[]
  brandName: string
  showPrice?: boolean
  linkable?: boolean
}

export default function BrandBranchLocationBadges({
  branches,
  brandName,
  showPrice = false,
  linkable = false,
}: BrandBranchLocationBadgesProps) {
  if (branches.length === 0) return null

  return (
    <div className="brand-branch-badges">
      {branches.map((branch) => {
        const label = getBranchLocationLabel(branch, brandName)
        const priceText = showPrice ? formatPriceBdt(branch.price_bdt) : null
        const ariaLabel = branch.is_sold_out
          ? `${label}, sold out${priceText ? `, ${priceText}` : ''}`
          : priceText
            ? `${label}, ${priceText}`
            : label
        const className = branch.is_sold_out
          ? 'brand-branch-badges__chip brand-branch-badges__chip--sold-out'
          : 'brand-branch-badges__chip'

        const content = (
          <>
            <span className="brand-branch-badges__label">{label}</span>
            {showPrice && priceText && (
              <span className="brand-branch-badges__price">{priceText}</span>
            )}
            {branch.is_sold_out && (
              <span className="brand-branch-badges__sold-out">Sold out</span>
            )}
          </>
        )

        if (linkable) {
          return (
            <Link
              key={branch.product_id}
              to={buildRestaurantLink(branch.restaurant_id)}
              className={className}
              aria-label={ariaLabel}
            >
              {content}
            </Link>
          )
        }

        return (
          <span key={branch.product_id} className={`${className} brand-branch-badges__chip--static`}>
            {content}
          </span>
        )
      })}
    </div>
  )
}
