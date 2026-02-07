'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useUIStore, RIGHT_SIDEBAR_CONFIG } from '@/stores/uiStore'
import { useResizable } from '@/hooks/useResizable'
import { useIsMobile, useIsMedium, useWindowWidth } from '@/hooks/useMediaQuery'
import { CollapseButton } from './CollapseButton'
import { IconNavStrip } from '@/components/sidebar-right/IconNavStrip'
import { ContentPanel } from '@/components/sidebar-right/ContentPanel'
import { cn } from '@/lib/utils'

export function RightSidebar() {
  const isMobile = useIsMobile()
  const isMedium = useIsMedium()
  const windowWidth = useWindowWidth()
  const { 
    rightSidebar, 
    toggleRightSidebar, 
    setRightSidebarWidth,
    activeMobileSidebar,
    closeMobileSidebar,
  } = useUIStore()
  const { isCollapsed, width } = rightSidebar

  // On medium screens, max width is 75% of screen
  // On large screens, max width is 40% of screen
  const maxWidth = isMedium 
    ? Math.floor(windowWidth * 0.75) 
    : Math.floor(windowWidth * 0.4)

  // On large screens, min width is 50% bigger (250 * 1.5 = 375)
  const minWidth = isMedium
    ? RIGHT_SIDEBAR_CONFIG.minWidth
    : Math.floor(RIGHT_SIDEBAR_CONFIG.minWidth * 1.5)

  const { isResizing, handleMouseDown } = useResizable({
    minWidth,
    maxWidth,
    initialWidth: width,
    onWidthChange: setRightSidebarWidth,
    direction: 'right',
  })

  // Mobile mode - render as overlay
  if (isMobile) {
    return (
      <AnimatePresence>
        {activeMobileSidebar === 'right' && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'fixed inset-0 z-50 flex flex-col',
              'bg-black/95 backdrop-blur-md'
            )}
          >
            {/* Mobile header with close button and icon nav */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <button
                onClick={closeMobileSidebar}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
                  'transition-colors'
                )}
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* Horizontal icon nav for mobile */}
              <div className="flex-1 flex justify-center">
                <IconNavStrip horizontal />
              </div>
              
              {/* Spacer for alignment */}
              <div className="w-10" />
            </div>

            {/* Content panel - scrollable */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ContentPanel />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    )
  }

  // Medium mode - overlay sidebar that slides over chat
  if (isMedium) {
    return (
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? RIGHT_SIDEBAR_CONFIG.collapsedWidth : width,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'absolute right-0 top-0 z-20 flex h-full overflow-hidden',
          'bg-black/90 backdrop-blur-md'
        )}
      >
        {/* Resize handle */}
        {!isCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            className={cn(
              'absolute left-0 top-0 h-full w-1 cursor-col-resize',
              'bg-transparent hover:bg-indigo-500/50',
              isResizing && 'bg-indigo-500/50'
            )}
          />
        )}

        {/* Collapse button */}
        <div className="absolute left-2 top-4 z-10">
          <CollapseButton
            isCollapsed={isCollapsed}
            onClick={() => toggleRightSidebar(isMedium)}
            direction="right"
            useChevronWhenOpen
          />
        </div>

        {/* Content panel - hidden when collapsed */}
        <motion.div
          initial={false}
          animate={{
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : 'auto',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'flex h-full min-h-0 flex-1 flex-col overflow-hidden',
            isCollapsed && 'pointer-events-none'
          )}
        >
          <ContentPanel />
        </motion.div>

        {/* Icon nav strip - always visible, on the right */}
        <div className={cn(
          'flex flex-col pt-16',
          !isCollapsed && 'border-l border-zinc-800'
        )}>
          <IconNavStrip />
        </div>
      </motion.aside>
    )
  }

  // Desktop mode - inline sidebar that pushes chat
  const displayWidth = isCollapsed ? RIGHT_SIDEBAR_CONFIG.collapsedWidth : width

  return (
    <motion.aside
      initial={false}
      animate={{ width: displayWidth }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'relative flex h-full overflow-hidden',
        'bg-black/60 backdrop-blur-sm'
      )}
    >
      {/* Resize handle */}
      {!isCollapsed && (
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            'absolute left-0 top-0 h-full w-1 cursor-col-resize',
            'bg-transparent hover:bg-indigo-500/50',
            isResizing && 'bg-indigo-500/50'
          )}
        />
      )}

      {/* Collapse button */}
      <div className="absolute left-2 top-4 z-10">
        <CollapseButton
          isCollapsed={isCollapsed}
          onClick={() => toggleRightSidebar(isMedium)}
          direction="right"
          useChevronWhenOpen
        />
      </div>

      {/* Content panel - hidden when collapsed */}
      <motion.div
        initial={false}
        animate={{
          opacity: isCollapsed ? 0 : 1,
          width: isCollapsed ? 0 : 'auto',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'flex h-full min-h-0 flex-1 flex-col overflow-hidden',
          isCollapsed && 'pointer-events-none'
        )}
      >
        <ContentPanel />
      </motion.div>

      {/* Icon nav strip - always visible, on the right */}
      <div className={cn(
        'flex flex-col pt-16',
        !isCollapsed && 'border-l border-zinc-800'
      )}>
        <IconNavStrip />
      </div>
    </motion.aside>
  )
}
