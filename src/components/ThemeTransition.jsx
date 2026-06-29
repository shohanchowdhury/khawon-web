import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MotionConfig, motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ThemeTransition() {
  const { transition } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !transition) return null

  const { x, y, radius } = transition

  return createPortal(
    <MotionConfig reducedMotion="never">
      <div
        className="theme-transition-root"
        aria-hidden="true"
        style={{
          '--transition-x': `${x}px`,
          '--transition-y': `${y}px`,
          '--transition-r': `${radius}px`,
        }}
      >
        <motion.div
          className="theme-transition-spiral"
          initial={{ rotate: 0, scale: 0, opacity: 0.9 }}
          animate={{ rotate: 720, scale: 1, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </MotionConfig>,
    document.body,
  )
}
