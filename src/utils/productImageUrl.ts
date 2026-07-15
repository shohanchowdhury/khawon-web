/** Mirror khawon-api dish_detail.normalize_product_image_url */
export function normalizeProductImageUrl(url: string | null | undefined): string | null {
  const trimmed = url?.trim()
  if (!trimmed) return null
  if (trimmed.includes('?width=%s')) {
    return trimmed.replace('?width=%s', '?width=400')
  }
  return trimmed
}

export function resolveCompareCardImages(
  dish: { image_url: string | null; restaurant: { image_url: string | null } },
  seenProductUrls: Set<string>,
): { imageUrl: string | null; fallbackUrl: string | null } {
  const productUrl = normalizeProductImageUrl(dish.image_url)
  const heroUrl = normalizeProductImageUrl(dish.restaurant.image_url)

  if (productUrl && seenProductUrls.has(productUrl)) {
    return {
      imageUrl: heroUrl,
      fallbackUrl: productUrl,
    }
  }

  if (productUrl) {
    seenProductUrls.add(productUrl)
  }

  return {
    imageUrl: productUrl,
    fallbackUrl: heroUrl,
  }
}
