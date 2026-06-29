import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

function SunIcon() {
  return (
    <svg className="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" fill="none">
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
      </g>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      />
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, toggleTheme, transition } = useTheme()
  const isDark = theme === 'dark'

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleClick}
      disabled={Boolean(transition)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={!isDark}
    >
      <span className="theme-toggle__inner">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'sun' : 'moon'}
            className="theme-toggle__icon-wrap"
            initial={{ opacity: 0, rotate: -40, scale: 0.85 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 40, scale: 0.85 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )
}
