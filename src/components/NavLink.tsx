import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

interface NavLinkProps {
  to: string
  children: ReactNode
  match?: 'exact' | 'prefix'
}

export default function NavLink({ to, children, match = 'exact' }: NavLinkProps) {
  const location = useLocation()
  const active =
    match === 'prefix' ? location.pathname.startsWith(to) : location.pathname === to

  return (
    <Link to={to} className={active ? 'nav-link nav-link--active' : 'nav-link'}>
      {children}
    </Link>
  )
}
