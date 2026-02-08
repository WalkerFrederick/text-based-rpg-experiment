'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useIsMobile, useIsMedium } from '@/hooks/useMediaQuery'
import { useUIStore } from '@/stores/uiStore'
import { LeftSidebar, LeftSidebarToggle } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { Backdrop } from '@/components/layout/Backdrop'
import { ChatArea } from '@/components/chat/ChatArea'

export default function Home() {
  const isMobile = useIsMobile()
  const isMedium = useIsMedium()
  const { leftSidebar, rightSidebar, toggleLeftSidebar, toggleRightSidebar } = useUIStore()
  
  // Track previous breakpoint state to detect transitions
  const prevIsMediumRef = useRef(isMedium)

  // Close sidebars when transitioning from large to medium breakpoint
  useEffect(() => {
    const wasLargeScreen = !prevIsMediumRef.current
    const isNowMediumScreen = isMedium

    if (wasLargeScreen && isNowMediumScreen) {
      // Transitioning from large to medium - collapse sidebars
      if (!leftSidebar.isCollapsed) {
        toggleLeftSidebar(true)
      }
      if (!rightSidebar.isCollapsed) {
        toggleRightSidebar(true)
      }
    }

    prevIsMediumRef.current = isMedium
  }, [isMedium, leftSidebar.isCollapsed, rightSidebar.isCollapsed, toggleLeftSidebar, toggleRightSidebar])

  // Collapse any open sidebar when clicking on chat area (medium screens only)
  const handleChatAreaClick = () => {
    if (!leftSidebar.isCollapsed) {
      toggleLeftSidebar(true)
    }
    if (!rightSidebar.isCollapsed) {
      toggleRightSidebar(true)
    }
  }

  // Mobile: Full-screen overlay sidebars with hamburger menu
  if (isMobile) {
    return (
      <>
        <div className="app-background" />
        <MobileHeader />
        <main className="h-dvh w-screen overflow-hidden pt-14">
          <ChatArea />
        </main>
        <AnimatePresence>
          <Backdrop />
        </AnimatePresence>
        <LeftSidebar />
        <RightSidebar />
      </>
    )
  }

  // Medium: Sidebars overlay chat, only one at a time
  if (isMedium) {
    return (
      <>
        <div className="app-background" />
        <div className="relative h-dvh w-screen overflow-hidden">
          {/* Chat takes full width, with padding for collapsed icon strip (56px) */}
          {/* Click to collapse any open sidebar */}
          <main 
            className="h-full w-full overflow-hidden pr-14"
            onClick={handleChatAreaClick}
          >
            <ChatArea />
          </main>

          {/* Sidebars overlay from edges */}
          <LeftSidebar />
          <AnimatePresence>
            <LeftSidebarToggle />
          </AnimatePresence>
          <RightSidebar />
        </div>
      </>
    )
  }

  // Desktop: Three-column layout with resizable sidebars
  return (
    <>
      <div className="app-background" />
      <div className="relative flex h-dvh w-screen overflow-hidden">
        <LeftSidebar />
        <AnimatePresence>
          <LeftSidebarToggle />
        </AnimatePresence>
        <main className="flex-1 overflow-hidden">
          <ChatArea />
        </main>
        <RightSidebar />
      </div>
    </>
  )
}
