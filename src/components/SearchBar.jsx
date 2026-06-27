import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ large = false, defaultValue = '' }) {
  const [query, setQuery] = useState(defaultValue)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form className={`search-bar ${large ? 'search-bar--large' : ''}`} onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search food — biriyani, ramen, fuchka..."
        aria-label="Search food type"
      />
      <button type="submit">Search</button>
    </form>
  )
}
