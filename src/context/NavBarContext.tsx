import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

export interface NavBarContextBack {
  href: string
  label: string
  ariaLabel?: string
}

export interface NavBarOverrides {
  searchDefaultValue?: string
  showContext?: boolean
  contextTitle?: string
  contextBack?: NavBarContextBack
}

interface NavBarContextValue {
  overrides: NavBarOverrides
  setOverrides: (overrides: NavBarOverrides) => void
}

const NavBarContext = createContext<NavBarContextValue | null>(null)

export function NavBarProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [overrides, setOverrides] = useState<NavBarOverrides>({})

  useEffect(() => {
    setOverrides({})
  }, [location.pathname])

  return (
    <NavBarContext.Provider value={{ overrides, setOverrides }}>
      {children}
    </NavBarContext.Provider>
  )
}

export function useNavBarOverrides() {
  const context = useContext(NavBarContext)
  if (!context) {
    throw new Error('useNavBarOverrides must be used within NavBarProvider')
  }
  return context
}
