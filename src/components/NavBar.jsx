import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar({ compact = false }) {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  return (
    <header className={`nav-bar ${compact ? 'nav-bar--compact' : ''}`}>
      <Link to="/" className="logo-link">খাওন</Link>

      <nav className="nav-bar__links">
        <Link
          to="/catalogue"
          className={location.pathname === '/catalogue' ? 'nav-link nav-link--active' : 'nav-link'}
        >
          Catalogue
        </Link>
        {isAuthenticated && (
          <Link
            to="/contribute"
            className={location.pathname === '/contribute' ? 'nav-link nav-link--active' : 'nav-link'}
          >
            Add listing
          </Link>
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
