import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  large?: boolean
  nav?: boolean
  defaultValue?: string
}

function SearchIcon() {
  return (
    <svg
      className="search-bar__icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16 16l4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function SearchBar({ large = false, nav = false, defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const navigate = useNavigate()

  useEffect(() => {
    setQuery(defaultValue)
  }, [defaultValue])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  if (nav) {
    return (
      <form className="search-bar search-bar--nav" onSubmit={handleSubmit}>
        <div className="search-bar__field">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food — biriyani, ramen, fuchka..."
            aria-label="Search food type"
          />
          <button type="submit" className="search-bar__submit" aria-label="Search">
            <SearchIcon />
          </button>
        </div>
      </form>
    )
  }

  const className = ['search-bar', large ? 'search-bar--large' : ''].filter(Boolean).join(' ')

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
