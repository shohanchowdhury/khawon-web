import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import NavBar from '@/components/NavBar'
import { useNavBarOverrides, type NavBarOverrides } from '@/context/NavBarContext'

function getRouteNavBarProps(pathname: string, search: string): NavBarOverrides & { showSearch: boolean } {
  const showSearch = pathname !== '/'

  if (pathname === '/search') {
    const query = new URLSearchParams(search).get('q') || ''
    return { showSearch, searchDefaultValue: query }
  }

  return { showSearch }
}

export default function AppNavBar() {
  const location = useLocation()
  const { overrides } = useNavBarOverrides()

  const props = useMemo(
    () => ({
      ...getRouteNavBarProps(location.pathname, location.search),
      ...overrides,
    }),
    [location.pathname, location.search, overrides],
  )

  return <NavBar {...props} />
}
