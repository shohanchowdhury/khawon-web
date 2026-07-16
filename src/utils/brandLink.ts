export function buildBrandLink(chainId: number): string {
  return `/brands/${chainId}`
}

export function buildBrandDishLink(
  chainId: number,
  foodTypeId: number,
  slug: string,
): string {
  return `/brands/${chainId}/dishes/${foodTypeId}/${encodeURIComponent(slug)}`
}

export function brandDishKey(dish: {
  brand: { id: number }
  food_type_id: number | null
  slug: string
}): string {
  return `${dish.brand.id}-${dish.food_type_id ?? 'none'}-${dish.slug}`
}

export function resolveBrandDishFoodTypeId(dish: {
  food_type_id: number | null
  food_type: { id: number } | null
}): number | null {
  return dish.food_type_id ?? dish.food_type?.id ?? null
}

export function getBranchLocationLabel(
  branch: { area: string | null; restaurant_name: string },
  brandName?: string,
): string {
  const area = branch.area?.trim()
  if (area) return area

  const name = branch.restaurant_name.trim()
  const separator = ' - '
  const separatorIndex = name.indexOf(separator)
  if (separatorIndex >= 0) {
    return name.slice(separatorIndex + separator.length).trim() || name
  }

  if (brandName?.trim()) {
    const prefix = `${brandName.trim()}${separator}`
    if (name.startsWith(prefix)) {
      return name.slice(prefix.length).trim() || name
    }
  }

  return name
}
