'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useUIStore, LEFT_SIDEBAR_CONFIG } from '@/stores/uiStore'
import { useResizable } from '@/hooks/useResizable'
import { useIsMobile, useIsMedium, useWindowWidth } from '@/hooks/useMediaQuery'
import { CollapseButton } from './CollapseButton'
import { CampaignList } from '@/components/sidebar-left/CampaignList'
import { AccountCard } from '@/components/sidebar-left/AccountCard'
import { cn } from '@/lib/utils'

export function LeftSidebar() {
  const isMobile = useIsMobile()
  const isMedium = useIsMedium()
  const windowWidth = useWindowWidth()
  const { 
    leftSidebar, 
    toggleLeftSidebar, 
    setLeftSidebarWidth,
    activeMobileSidebar,
    closeMobileSidebar,
  } = useUIStore()
  const { isCollapsed, width } = leftSidebar

  // Max width is percentage-based: 75% on medium, 40% on large
  const maxWidth = isMedium 
    ? Math.floor(windowWidth * 0.75) 
    : Math.floor(windowWidth * 0.4)

  const { isResizing, handleMouseDown } = useResizable({
    minWidth: LEFT_SIDEBAR_CONFIG.minWidth,
    maxWidth,
    initialWidth: width,
    onWidthChange: setLeftSidebarWidth,
    direction: 'left',
  })

  // Mobile mode - render as overlay
  if (isMobile) {
    return (
      <AnimatePresence>
        {activeMobileSidebar === 'left' && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'fixed inset-0 z-50 flex flex-col',
              'bg-black/95 backdrop-blur-md'
            )}
          >
            {/* Mobile header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-2 rounded border border-zinc-700 bg-zinc-800/50 px-3 py-2">
                <span className="text-sm text-zinc-300">PlaceholderLogo.</span>
              </div>
              <button
                onClick={closeMobileSidebar}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
                  'transition-colors'
                )}
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Campaign list - scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <CampaignList />
            </div>

            {/* Account card - fixed at bottom */}
            <div className="p-4 border-t border-zinc-800">
              <AccountCard />
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
          x: isCollapsed ? -width : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ width }}
        className={cn(
          'absolute left-0 top-0 z-20 flex h-full flex-col overflow-hidden',
          'bg-black/90 backdrop-blur-md'
        )}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 rounded border border-zinc-700 bg-zinc-800/50 px-3 py-2">
            <span className="text-sm text-zinc-300">PlaceholderLogo.</span>
          </div>
          <CollapseButton
            isCollapsed={isCollapsed}
            onClick={() => toggleLeftSidebar(isMedium)}
            direction="left"
            useChevronWhenOpen
          />
        </div>

        {/* Campaign list - scrollable */}
        <div className="flex-1 overflow-y-auto px-4">
          <CampaignList />
        </div>

        {/* Account card - fixed at bottom */}
        <div className="p-4">
          <AccountCard />
        </div>

        {/* Resize handle */}
        {!isCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            className={cn(
              'absolute right-0 top-0 h-full w-1 cursor-col-resize',
              'bg-transparent hover:bg-indigo-500/50',
              isResizing && 'bg-indigo-500/50'
            )}
          />
        )}
      </motion.aside>
    )
  }

  // Desktop mode - inline sidebar that pushes chat
  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 0 : width,
        opacity: isCollapsed ? 0 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'relative flex h-full flex-col overflow-hidden',
        'bg-black/70 backdrop-blur-sm',
        isCollapsed && 'pointer-events-none'
      )}
    >
      {/* Header with logo and collapse button */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 rounded border border-zinc-700 bg-zinc-800/50 px-3 py-2">
          <span className="text-sm text-zinc-300">PlaceholderLogo.</span>
        </div>
        <CollapseButton
          isCollapsed={isCollapsed}
          onClick={() => toggleLeftSidebar(isMedium)}
          direction="left"
          useChevronWhenOpen
        />
      </div>

      {/* Campaign list - scrollable */}
      <div className="flex-1 overflow-y-auto px-4">
        <CampaignList />
      </div>

      {/* Account card - fixed at bottom */}
      <div className="p-4">
        <AccountCard />
      </div>

      {/* Resize handle */}
      {!isCollapsed && (
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            'absolute right-0 top-0 h-full w-1 cursor-col-resize',
            'bg-transparent hover:bg-indigo-500/50',
            isResizing && 'bg-indigo-500/50'
          )}
        />
      )}
    </motion.aside>
  )
}

// Floating toggle button when sidebar is collapsed (desktop and medium)
export function LeftSidebarToggle() {
  const isMobile = useIsMobile()
  const isMedium = useIsMedium()
  const { leftSidebar, toggleLeftSidebar } = useUIStore()

  // Don't show on mobile - use MobileHeader instead
  if (isMobile) return null
  if (!leftSidebar.isCollapsed) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute left-4 top-4 z-30"
    >
      <CollapseButton
        isCollapsed={true}
        onClick={() => toggleLeftSidebar(isMedium)}
        direction="left"
      />
    </motion.div>
  )
}
