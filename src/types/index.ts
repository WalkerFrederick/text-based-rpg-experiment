// Campaign types
export interface Campaign {
  id: string
  title: string
  characterName: string
  level: number
}

// Sidebar types
export interface SidebarState {
  isCollapsed: boolean
  width: number
}

export interface LeftSidebarConfig {
  minWidth: number
  maxWidth: number
  defaultWidth: number
}

export interface RightSidebarConfig {
  minWidth: number
  maxWidth: number
  defaultWidth: number
}

// Right sidebar navigation
export type RightSidebarTab = 'character' | 'inventory' | 'rules' | 'debug'

export interface NavItem {
  id: RightSidebarTab
  label: string
  icon: string
}

// Chat types (for future use)
export interface ChatMessage {
  id: string
  content: string
  sender: 'player' | 'gamemaster'
  timestamp: Date
}

// Account types
export interface UserAccount {
  id: string
  username: string
  avatarUrl?: string
}
