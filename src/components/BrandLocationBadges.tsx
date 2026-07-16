import type { RestaurantSummaryOut } from '@/types/api'
import { getBranchLocationLabel } from '@/utils/brandLink'

interface BrandLocationBadgesProps {
  branches: RestaurantSummaryOut[]
  brandName: string
}

export default function BrandLocationBadges({
  branches,
  brandName,
}: BrandLocationBadgesProps) {
  if (branches.length === 0) return null

  return (
    <div className="brand-branch-badges brand-branch-badges--static">
      {branches.map((branch) => {
        const label = getBranchLocationLabel(
          { area: branch.area, restaurant_name: branch.name },
          brandName,
        )
        return (
          <span
            key={branch.id}
            className="brand-branch-badges__chip brand-branch-badges__chip--static"
          >
            {label}
          </span>
        )
      })}
    </div>
  )
}
