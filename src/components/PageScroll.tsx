import { forwardRef, type ReactNode } from 'react'

interface PageScrollProps {
  children: ReactNode
  className?: string
}

const PageScroll = forwardRef<HTMLDivElement, PageScrollProps>(function PageScroll(
  { children, className },
  ref,
) {
  return (
    <div
      ref={ref}
      className={['page-scroll', 'khawon-scrollbar', className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  )
})

export default PageScroll
