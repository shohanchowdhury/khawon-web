import { MotionConfig, motion } from 'framer-motion'
import type { CSSProperties } from 'react'

interface FoodStageKeywordDriftProps {
  tags: string[]
}

const MAIN_LINE_COUNT = 28
const CORNER_LINE_COUNT = 10
const TRACK_PHRASE_REPEATS = 10
const SIZES = ['lg', 'md', 'sm'] as const

type LineSize = (typeof SIZES)[number]

interface LineConfig {
  size: LineSize
  duration: number
  delay: number
}

function buildLineConfig(count: number, delayOffset = 0): LineConfig[] {
  return Array.from({ length: count }, (_, index) => ({
    size: SIZES[index % SIZES.length]!,
    duration: 260 + (index % 5) * 40,
    delay: delayOffset + index * -26,
  }))
}

const MAIN_LINE_CONFIG = buildLineConfig(MAIN_LINE_COUNT)
const CORNER_TR_LINE_CONFIG = buildLineConfig(CORNER_LINE_COUNT, -12)
const CORNER_BL_LINE_CONFIG = buildLineConfig(CORNER_LINE_COUNT, -24)

function buildTrackText(tags: string[], repeats = TRACK_PHRASE_REPEATS): string {
  const phrase = tags.join(' · ')
  return Array.from({ length: repeats }, () => phrase).join(' · ') + ' · '
}

interface KeywordFieldProps {
  className: string
  lines: LineConfig[]
  forwardText: string
  reverseText: string
  keyPrefix: string
}

function KeywordField({
  className,
  lines,
  forwardText,
  reverseText,
  keyPrefix,
}: KeywordFieldProps) {
  return (
    <div className={className}>
      {lines.map((line, index) => {
        const trackText = index % 2 === 0 ? forwardText : reverseText
        return (
          <div
            key={`${keyPrefix}-${index}`}
            className={[
              'food-stage__keywords-line',
              `food-stage__keywords-line--${line.size}`,
            ].join(' ')}
          >
            <div
              className="food-stage__keywords-track"
              style={
                {
                  '--keywords-duration': `${line.duration}s`,
                  '--keywords-delay': `${line.delay}s`,
                } as CSSProperties
              }
            >
              <span className="food-stage__keywords-text">{trackText}</span>
              <span className="food-stage__keywords-text" aria-hidden="true">
                {trackText}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function FoodStageKeywordDrift({ tags }: FoodStageKeywordDriftProps) {
  const forwardText = buildTrackText(tags)
  const reverseText = buildTrackText([...tags].reverse())

  return (
    <MotionConfig reducedMotion="never">
      <motion.div
        className="food-stage__keywords"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <KeywordField
          className="food-stage__keywords-field"
          lines={MAIN_LINE_CONFIG}
          forwardText={forwardText}
          reverseText={reverseText}
          keyPrefix="main"
        />
        <KeywordField
          className="food-stage__keywords-field food-stage__keywords-field--tr"
          lines={CORNER_TR_LINE_CONFIG}
          forwardText={forwardText}
          reverseText={reverseText}
          keyPrefix="tr"
        />
        <KeywordField
          className="food-stage__keywords-field food-stage__keywords-field--bl"
          lines={CORNER_BL_LINE_CONFIG}
          forwardText={forwardText}
          reverseText={reverseText}
          keyPrefix="bl"
        />
      </motion.div>
    </MotionConfig>
  )
}
