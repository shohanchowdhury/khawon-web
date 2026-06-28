import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export default function HomeAccentBackground({ accent }) {
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.65, ease: 'easeInOut' }

  return (
    <div className="home-page__accent-wrap" aria-hidden="true">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={accent}
          className="home-page__accent-bg"
          style={{ '--home-accent': accent }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        />
      </AnimatePresence>
    </div>
  )
}
