export default function FoodImage({ name, imageUrl, className = '' }) {
  const letter = (name || '?').trim().charAt(0).toUpperCase()

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`food-card__image ${className}`.trim()}
        loading="lazy"
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
