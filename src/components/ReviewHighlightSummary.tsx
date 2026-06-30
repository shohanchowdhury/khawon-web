import DetailMeta from '@/components/DetailMeta'

interface ReviewHighlightSummaryProps {
  quote: string
  rating: number | null | undefined
  reviewCount: number
  className?: string
}

export default function ReviewHighlightSummary({
  quote,
  rating,
  reviewCount,
  className,
}: ReviewHighlightSummaryProps) {
  return (
    <div className={['review-highlight-summary', className].filter(Boolean).join(' ')}>
      <p className="review-highlight-summary__quote">{quote}</p>
      <DetailMeta rating={rating} reviewCount={reviewCount} ratingSize="sm" />
    </div>
  )
}
