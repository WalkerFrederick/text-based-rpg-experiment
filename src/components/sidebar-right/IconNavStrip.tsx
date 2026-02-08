'use client'

import { User, Backpack, BookOpen, Bug } from 'lucide-react'
import type { RightSidebarTab } from '@/types'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

interface NavItemConfig {
  id: RightSidebarTab
  label: string
  icon: React.ReactNode
}

const navItems: NavItemConfig[] = [
  { id: 'character', label: 'Character', icon: <User className="h-5 w-5" /> },
  { id: 'inventory', label: 'Inventory', icon: <Backpack className="h-5 w-5" /> },
  { id: 'rules', label: 'Rules', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'debug', label: 'Debug', icon: <Bug className="h-5 w-5" /> },
]

interface IconNavStripProps {
  horizontal?: boolean
}

export function IconNavStrip({ horizontal = false }: IconNavStripProps) {
  const { rightSidebar, setActiveTab, expandRightSidebar } = useUIStore()
  const { activeTab, isCollapsed } = rightSidebar

  const handleNavClick = (tabId: RightSidebarTab) => {
    setActiveTab(tabId)
    // If sidebar is collapsed, expand it
    if (isCollapsed) {
      expandRightSidebar()
    }
  }

  return (
    <nav className={cn(
      'flex gap-2 px-2 py-2',
      horizontal ? 'flex-row' : 'flex-col'
    )}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            'text-zinc-400 transition-all duration-150',
            'hover:bg-zinc-700 hover:text-zinc-200',
            activeTab === item.id && 'bg-indigo-600/20 text-indigo-400'
          )}
          aria-label={item.label}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </nav>
  )
}
