export default function FoodImage({ name, imageUrl, className = '', priority = false, style }) {
  const letter = (name || '?').trim().charAt(0).toUpperCase()

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`food-card__image ${className}`.trim()}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    )
  }

  return (
    <div
      className={`food-card__placeholder ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      {letter}
    </div>
  )
}
