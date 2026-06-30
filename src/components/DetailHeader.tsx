import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode, Ref } from 'react'

interface DetailHeaderProps {
  title: string
  editHref?: string
  titleClassName?: string
  titleAnchorRef?: Ref<HTMLDivElement | null>
  titleInNav?: boolean
  titleLayoutId?: string
  children?: ReactNode
}

export default function DetailHeader({
  title,
  editHref,
  titleClassName = '',
  titleAnchorRef,
  titleInNav = false,
  titleLayoutId,
  children,
}: DetailHeaderProps) {
  const titleClass = titleClassName
    ? `${titleClassName}${titleInNav ? ` ${titleClassName}--placeholder` : ''}`
    : ''

  return (
    <div className="detail-header">
      <div className="detail-header__row" ref={titleAnchorRef}>
        {titleInNav ? (
          <h1 className={titleClass} aria-hidden="true">
            {title}
          </h1>
        ) : titleLayoutId ? (
          <motion.h1 layoutId={titleLayoutId} className={titleClass}>
            {title}
          </motion.h1>
        ) : (
          <h1 className={titleClass}>{title}</h1>
        )}
        {editHref && (
          <Link to={editHref} className="edit-link">
            Edit
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}
