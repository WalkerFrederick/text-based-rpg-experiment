'use client'

import { PanelLeft, PanelRight, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapseButtonProps {
  isCollapsed: boolean
  onClick: () => void
  direction: 'left' | 'right'
  className?: string
  useChevronWhenOpen?: boolean // If true, show chevron when open; if false, show X
}

export function CollapseButton({
  isCollapsed,
  onClick,
  direction,
  className,
  useChevronWhenOpen = false,
}: CollapseButtonProps) {
  // When collapsed: show panel icon to indicate "open this panel"
  // When expanded: show X or chevron based on useChevronWhenOpen prop
  const getIcon = () => {
    if (isCollapsed) {
      // Show panel icon when collapsed
      return direction === 'left' 
        ? <PanelLeft className="h-5 w-5" /> 
        : <PanelRight className="h-5 w-5" />
    }
    
    // When expanded
    if (useChevronWhenOpen) {
      // Show chevron pointing toward the edge (to collapse)
      return direction === 'left'
        ? <ChevronLeft className="h-5 w-5" />
        : <ChevronRight className="h-5 w-5" />
    }
    
    // Show X icon
    return <X className="h-5 w-5" />
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-lg',
        'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200',
        'transition-colors duration-150',
        className
      )}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {getIcon()}
    </button>
  )
}
