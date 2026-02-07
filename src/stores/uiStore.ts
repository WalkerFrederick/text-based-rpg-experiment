'use client'

import { create } from 'zustand'
import type { RightSidebarTab } from '@/types'

// Mobile sidebar type
export type MobileSidebar = 'left' | 'right' | null

interface UIState {
  // Left sidebar
  leftSidebar: {
    isCollapsed: boolean
    width: number
  }
  // Right sidebar
  rightSidebar: {
    isCollapsed: boolean
    width: number
    activeTab: RightSidebarTab
  }
  // Mobile state
  activeMobileSidebar: MobileSidebar
  // Actions
  toggleLeftSidebar: (isMediumScreen?: boolean) => void
  setLeftSidebarWidth: (width: number) => void
  toggleRightSidebar: (isMediumScreen?: boolean) => void
  setRightSidebarWidth: (width: number) => void
  setActiveTab: (tab: RightSidebarTab) => void
  expandLeftSidebar: (isMediumScreen?: boolean) => void
  expandRightSidebar: (isMediumScreen?: boolean) => void
  // Mobile actions
  openMobileSidebar: (side: 'left' | 'right') => void
  closeMobileSidebar: () => void
}

// Sidebar constraints
export const LEFT_SIDEBAR_CONFIG = {
  minWidth: 200,
  maxWidth: 400,
  defaultWidth: 350,
  collapsedWidth: 0,
}

export const RIGHT_SIDEBAR_CONFIG = {
  minWidth: 250,
  maxWidth: 800,
  defaultWidth: 500,
  collapsedWidth: 56, // Just the icon strip with padding
}

export const useUIStore = create<UIState>((set) => ({
  leftSidebar: {
    isCollapsed: false,
    width: LEFT_SIDEBAR_CONFIG.defaultWidth,
  },
  rightSidebar: {
    isCollapsed: false,
    width: RIGHT_SIDEBAR_CONFIG.defaultWidth,
    activeTab: 'character',
  },
  activeMobileSidebar: null,

  toggleLeftSidebar: (isMediumScreen?: boolean) =>
    set((state) => {
      const willExpand = state.leftSidebar.isCollapsed
      return {
        leftSidebar: {
          ...state.leftSidebar,
          isCollapsed: !state.leftSidebar.isCollapsed,
        },
        // On medium screens, collapse right sidebar when expanding left
        ...(isMediumScreen && willExpand && !state.rightSidebar.isCollapsed
          ? { rightSidebar: { ...state.rightSidebar, isCollapsed: true } }
          : {}),
      }
    }),

  setLeftSidebarWidth: (width: number) =>
    set((state) => ({
      leftSidebar: {
        ...state.leftSidebar,
        width: Math.min(Math.max(width, LEFT_SIDEBAR_CONFIG.minWidth), LEFT_SIDEBAR_CONFIG.maxWidth),
      },
    })),

  toggleRightSidebar: (isMediumScreen?: boolean) =>
    set((state) => {
      const willExpand = state.rightSidebar.isCollapsed
      return {
        rightSidebar: {
          ...state.rightSidebar,
          isCollapsed: !state.rightSidebar.isCollapsed,
        },
        // On medium screens, collapse left sidebar when expanding right
        ...(isMediumScreen && willExpand && !state.leftSidebar.isCollapsed
          ? { leftSidebar: { ...state.leftSidebar, isCollapsed: true } }
          : {}),
      }
    }),

  expandLeftSidebar: (isMediumScreen?: boolean) =>
    set((state) => ({
      leftSidebar: {
        ...state.leftSidebar,
        isCollapsed: false,
      },
      // On medium screens, collapse right sidebar when expanding left
      ...(isMediumScreen && !state.rightSidebar.isCollapsed
        ? { rightSidebar: { ...state.rightSidebar, isCollapsed: true } }
        : {}),
    })),

  expandRightSidebar: (isMediumScreen?: boolean) =>
    set((state) => ({
      rightSidebar: {
        ...state.rightSidebar,
        isCollapsed: false,
      },
      // On medium screens, collapse left sidebar when expanding right
      ...(isMediumScreen && !state.leftSidebar.isCollapsed
        ? { leftSidebar: { ...state.leftSidebar, isCollapsed: true } }
        : {}),
    })),

  setRightSidebarWidth: (width: number) =>
    set((state) => ({
      rightSidebar: {
        ...state.rightSidebar,
        width: Math.min(Math.max(width, RIGHT_SIDEBAR_CONFIG.minWidth), RIGHT_SIDEBAR_CONFIG.maxWidth),
      },
    })),

  setActiveTab: (tab: RightSidebarTab) =>
    set((state) => ({
      rightSidebar: {
        ...state.rightSidebar,
        activeTab: tab,
      },
    })),

  openMobileSidebar: (side: 'left' | 'right') =>
    set(() => ({
      activeMobileSidebar: side,
    })),

  closeMobileSidebar: () =>
    set(() => ({
      activeMobileSidebar: null,
    })),
}))
