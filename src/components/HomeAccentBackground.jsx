import { AnimatePresence, motion, MotionConfig } from 'framer-motion'

export default function HomeAccentBackground({ accent }) {
  return (
    <MotionConfig reducedMotion="never">
      <div className="home-page__accent-wrap" aria-hidden="true">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={accent}
            className="home-page__accent-bg"
            style={{ '--home-accent': accent }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
