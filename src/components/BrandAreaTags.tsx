interface BrandAreaTagsProps {
  areas: string[]
  className?: string
}

export default function BrandAreaTags({ areas, className }: BrandAreaTagsProps) {
  if (areas.length === 0) return null

  return (
    <div className={['brand-branch-badges', 'brand-branch-badges--static', className].filter(Boolean).join(' ')}>
      {areas.map((area) => (
        <span key={area} className="brand-branch-badges__chip brand-branch-badges__chip--static">
          {area}
        </span>
      ))}
    </div>
  )
}
