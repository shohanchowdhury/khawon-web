export function formatPriceBdt(amount: number | null | undefined): string | null {
  if (amount == null || Number.isNaN(amount)) {
    return null
  }
  const rounded = Math.round(amount)
  return `৳${rounded.toLocaleString('en-BD')}`
}

export function getDishDisplayPrice(dish: {
  price_bdt: number | null
  variations: { price_bdt: number | null }[] | null
}): { text: string; prefix?: string } | null {
  const variationPrices = (dish.variations ?? [])
    .map((v) => v.price_bdt)
    .filter((p): p is number => p != null && !Number.isNaN(p))

  if (variationPrices.length > 0) {
    const minPrice = Math.min(...variationPrices)
    const formatted = formatPriceBdt(minPrice)
    return formatted ? { text: formatted, prefix: 'from' } : null
  }

  const formatted = formatPriceBdt(dish.price_bdt)
  return formatted ? { text: formatted } : null
}

export function getBrandDishDisplayPrice(dish: {
  price_min_bdt: number
  price_varies: boolean
}): { text: string; prefix?: string } | null {
  const formatted = formatPriceBdt(dish.price_min_bdt)
  if (!formatted) return null
  return dish.price_varies ? { text: formatted, prefix: 'from' } : { text: formatted }
}

export function formatBranchAvailability(
  branchCount: number,
  brandBranchTotal: number,
): string | null {
  if (branchCount >= brandBranchTotal || brandBranchTotal <= 1) {
    return null
  }
  return `at ${branchCount} of ${brandBranchTotal} branches`
}
