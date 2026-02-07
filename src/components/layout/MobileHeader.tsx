'use client'

import { PanelLeft, PanelRight } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function MobileHeader() {
  const { openMobileSidebar } = useUIStore()

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-30',
        'flex h-14 items-center justify-between px-4',
        'bg-black/80 backdrop-blur-md',
        'border-b border-zinc-800'
      )}
    >
      {/* Left panel - opens campaigns sidebar */}
      <button
        onClick={() => openMobileSidebar('left')}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
          'transition-colors'
        )}
        aria-label="Open campaigns menu"
      >
        <PanelLeft className="h-5 w-5" />
      </button>

      {/* Center logo */}
      <div className="flex items-center gap-2 rounded border border-zinc-700 bg-zinc-800/50 px-3 py-2">
        <span className="text-sm text-zinc-300">PlaceholderLogo.</span>
      </div>

      {/* Right menu - opens character panel */}
      <button
        onClick={() => openMobileSidebar('right')}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
          'transition-colors'
        )}
        aria-label="Open character panel"
      >
        <PanelRight className="h-5 w-5" />
      </button>
    </header>
  )
}
