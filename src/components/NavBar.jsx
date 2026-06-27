import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SearchBar from './SearchBar'

export default function NavBar({ compact = false, showSearch = false }) {
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
          to="/catalogue"
          className={location.pathname === '/catalogue' ? 'nav-link nav-link--active' : 'nav-link'}
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
          <>
            <Link
              to="/contribute"
              className={location.pathname === '/contribute' ? 'nav-link nav-link--active' : 'nav-link'}
            >
              Add listing
            </Link>
            <Link
              to="/manage"
              className={location.pathname.startsWith('/manage') ? 'nav-link nav-link--active' : 'nav-link'}
            >
              Manage
            </Link>
          </>
        )}
        {isAuthenticated ? (
          <>
            <span className="nav-user">Hi, {user.username}</span>
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
