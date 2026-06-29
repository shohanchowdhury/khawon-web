import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  large?: boolean
  nav?: boolean
  defaultValue?: string
}

export default function SearchBar({ large = false, nav = false, defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const className = [
    'search-bar',
    large ? 'search-bar--large' : '',
    nav ? 'search-bar--nav' : '',
  ].filter(Boolean).join(' ')

  return (
    <form className={className} onSubmit={handleSubmit}>
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
