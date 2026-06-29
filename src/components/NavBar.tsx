import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import SearchBar from '@/components/SearchBar'
import ThemeToggle from '@/components/ThemeToggle'

interface NavBarProps {
  compact?: boolean
  showSearch?: boolean
}

export default function NavBar({ compact = false, showSearch = false }: NavBarProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  return (
    <header
      className={`nav-bar${compact ? ' nav-bar--compact' : ''}${showSearch ? ' nav-bar--with-search' : ''}`}
    >
      <Link to="/" className="logo-link">খাওন</Link>

      {showSearch && (
        <div className="nav-bar__search">
          <SearchBar nav />
        </div>
      )}

      <nav className="nav-bar__links">
        <Link
          to="/foods"
          className={location.pathname === '/foods' ? 'nav-link nav-link--active' : 'nav-link'}
        >
          Foods
        </Link>
        <Link
          to="/restaurants"
          className={location.pathname === '/restaurants' ? 'nav-link nav-link--active' : 'nav-link'}
        >
          Restaurants
        </Link>
        {isAuthenticated && (
          <Link
            to="/manage"
            className={location.pathname.startsWith('/manage') ? 'nav-link nav-link--active' : 'nav-link'}
          >
            Manage
          </Link>
        )}
        <ThemeToggle />
        {isAuthenticated ? (
          <>
            <span className="nav-user">Hi, {user?.username}</span>
            <button type="button" className="nav-btn" onClick={logout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Sign in</Link>
            <Link to="/register" className="nav-btn nav-btn--primary">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}
