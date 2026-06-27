const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || `Request failed (${response.status})`)
  }

  if (response.status === 204) return null
  return response.json()
}

export function searchFood(query) {
  return request(`/search/?q=${encodeURIComponent(query)}`)
}

export function getRestaurant(id) {
  return request(`/restaurants/${id}`)
}

export function getRestaurantReviews(id) {
  return request(`/restaurants/${id}/reviews`)
}

export function submitReview(data) {
  return request('/reviews/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function listFoodTypes() {
  return request('/food-types/')
}
