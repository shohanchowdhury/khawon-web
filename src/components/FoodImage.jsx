export default function FoodImage({ name, imageUrl, className = '', priority = false }) {
  const letter = (name || '?').trim().charAt(0).toUpperCase()

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`food-card__image ${className}`.trim()}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    )
  }

  return (
    <div
      className={`food-card__placeholder ${className}`.trim()}
      aria-hidden="true"
    >
      {letter}
    </div>
  )
}
