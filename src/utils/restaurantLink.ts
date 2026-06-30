export function buildRestaurantLink(
  restaurantId: number,
  options?: { foodTypeId?: number; searchQuery?: string },
): string {
  const params = new URLSearchParams()
  if (options?.foodTypeId) params.set('foodTypeId', String(options.foodTypeId))
  if (options?.searchQuery) params.set('q', options.searchQuery)
  const query = params.toString()
  return `/restaurant/${restaurantId}${query ? `?${query}` : ''}`
}
