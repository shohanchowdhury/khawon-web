import NavLink from '@/components/NavLink'
import { NavButton } from '@/components/NavButton'
import SearchBar from '@/components/SearchBar'
import ThemeToggle from '@/components/ThemeToggle'
import UserMenu from '@/components/UserMenu'
import { useAuth } from '@/context/AuthContext'
import { useAuthModal } from '@/context/AuthModalContext'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface NavBarContextBack {
  href: string
  label: string
  ariaLabel?: string
}

interface NavBarProps {
  compact?: boolean
  showSearch?: boolean
  searchDefaultValue?: string
  showContext?: boolean
  contextTitle?: string
  contextBack?: NavBarContextBack
}

const searchSpring = { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.85 }

export default function NavBar({
  compact = false,
  showSearch = false,
  searchDefaultValue = '',
  showContext = false,
  contextTitle,
  contextBack,
}: NavBarProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const { openAuthModal } = useAuthModal()

  const hasContext = showContext && (contextTitle || contextBack)

  return (
    <header
      className={[
        'nav-bar',
        compact && 'nav-bar--compact',
        !showSearch && 'nav-bar--no-search',
        hasContext && 'nav-bar--with-context',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="nav-bar__brand">
        <Link to="/" className="logo-link">খাওন</Link>

        {hasContext && (
          <div className="nav-bar__context">
            {contextBack ? (
              <div className="nav-bar__context-crumb">
                <motion.div layoutId="food-detail-back" className="nav-bar__context-back-wrap">
                  <Link
                    to={contextBack.href}
                    className="nav-bar__context-back"
                    aria-label={contextBack.ariaLabel ?? contextBack.label}
                  >
                    {contextBack.label}
                  </Link>
                </motion.div>
                {contextTitle && (
                  <motion.h1 layoutId="food-detail-title" className="nav-bar__context-title">
                    <Link
                      to={contextBack.href}
                      className="nav-bar__context-title-link"
                      aria-label={contextBack.ariaLabel ?? contextBack.label}
                    >
                      {contextTitle}
                    </Link>
                  </motion.h1>
                )}
              </div>
            ) : (
              contextTitle && (
                <motion.h1 layoutId="food-detail-title" className="nav-bar__context-title">
                  {contextTitle}
                </motion.h1>
              )
            )}
          </div>
        )}
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {showSearch && (
          <motion.div
            key="nav-search"
            layout
            className="nav-bar__search"
            initial={{ opacity: 0, scaleX: 0.92 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.92 }}
            style={{ originX: hasContext ? 1 : 0.5, originY: 0.5 }}
            transition={searchSpring}
          >
            <SearchBar nav defaultValue={searchDefaultValue} />
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="nav-bar__links">
        <div className="nav-bar__pages">
          <NavLink to="/foods">Foods</NavLink>
          <NavLink to="/restaurants">Restaurants</NavLink>
          {isAuthenticated && (
            <NavLink to="/manage" match="prefix">
              Manage
            </NavLink>
          )}
        </div>

        <div className="nav-bar__tools">
          {isAuthenticated && user ? (
            <UserMenu username={user.username} onSignOut={logout} />
          ) : (
            <NavButton variant="primary" onClick={() => openAuthModal('login')}>
              Sign in
            </NavButton>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
