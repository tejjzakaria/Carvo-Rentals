import React from 'react'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

// Layout configuration - adjust these values as needed
const LAYOUT_CONFIG = {
  container: {
    maxWidth: 'max-w-7xl',
    padding: 'px-4 sm:px-6 lg:px-8',
    margin: 'mx-auto',
  },
  section: {
    marginY: 'my-8 md:my-12 lg:my-16',
  },
}

const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div className={`${LAYOUT_CONFIG.container.maxWidth} ${LAYOUT_CONFIG.container.padding} ${LAYOUT_CONFIG.container.margin} ${className}`}>
      {children}
    </div>
  )
}

// Optional: Export layout config for reuse in other components
export { LAYOUT_CONFIG }
export default Layout
