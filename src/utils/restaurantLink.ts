export function buildRestaurantLink(
  restaurantId: number,
  options?: { foodTypeId?: number; category?: string; searchQuery?: string },
): string {
  const params = new URLSearchParams()
  if (options?.foodTypeId) params.set('foodTypeId', String(options.foodTypeId))
  if (options?.category?.trim()) params.set('category', options.category.trim())
  if (options?.searchQuery) params.set('q', options.searchQuery)
  const query = params.toString()
  return `/restaurant/${restaurantId}${query ? `?${query}` : ''}`
}
