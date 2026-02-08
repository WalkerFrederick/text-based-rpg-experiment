'use client'

import { create } from 'zustand'
import characterData from '@/data/character.json'

// Types
export interface PlayerStats {
  strength: number
  speed: number
  knowledge: number
  presence: number
}

export interface Trait {
  name: string
  description: string
}

export interface InventoryItem {
  name: string
  description: string
  quantity: number
}

export interface PlayerCharacter {
  name: string
  stats: PlayerStats
  traits: Trait[]
  inventory: InventoryItem[]
}

export interface InventoryChange {
  add?: InventoryItem[]
  remove?: { name: string; quantity?: number }[]
}

export interface PlayerUpdate {
  name?: string
}

interface PlayerState {
  player: PlayerCharacter
  isLoaded: boolean

  // Actions
  loadCharacter: () => void
  setName: (name: string) => void
  addItem: (item: InventoryItem) => void
  removeItem: (name: string, quantity?: number) => void
  updateItemQuantity: (name: string, quantity: number) => void
  applyInventoryChanges: (changes: InventoryChange) => void
  applyPlayerUpdates: (updates: PlayerUpdate) => void
}

/**
 * Format a stat modifier for display (e.g., +2 or -1)
 */
function formatModifier(value: number): string {
  if (value >= 0) {
    return `+${value}`
  }
  return `${value}`
}

/**
 * Format the player character data for inclusion in the system prompt
 */
export function formatPlayerForPrompt(player: PlayerCharacter): string {
  const lines: string[] = []

  if (player.name) {
    lines.push(`NAME: ${player.name}`)
  } else {
    lines.push('NAME: (Not yet chosen)')
    lines.push('  NOTE: The player has not chosen a name yet. Early in the conversation,')
    lines.push('  ask them what they would like to be called. When they provide a name,')
    lines.push('  include "playerUpdates": { "name": "Their Name" } in your response.')
  }
  lines.push('')

  lines.push('STATS:')
  lines.push(`  Strength: ${formatModifier(player.stats.strength)}`)
  lines.push(`  Speed: ${formatModifier(player.stats.speed)}`)
  lines.push(`  Knowledge: ${formatModifier(player.stats.knowledge)}`)
  lines.push(`  Presence: ${formatModifier(player.stats.presence)}`)
  lines.push('')

  if (player.traits.length > 0) {
    lines.push('TRAITS:')
    player.traits.forEach((trait) => {
      lines.push(`  ${trait.name}: ${trait.description}`)
    })
    lines.push('')
  }

  lines.push('INVENTORY:')
  if (player.inventory.length > 0) {
    player.inventory.forEach((item) => {
      const qty = item.quantity > 1 ? ` (x${item.quantity})` : ''
      lines.push(`  - ${item.name}${qty}: ${item.description}`)
    })
  } else {
    lines.push('  (empty)')
  }

  return lines.join('\n')
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: characterData as PlayerCharacter,
  isLoaded: true,

  loadCharacter: () => {
    set({
      player: characterData as PlayerCharacter,
      isLoaded: true,
    })
  },

  setName: (name) => {
    set((state) => ({
      player: {
        ...state.player,
        name,
      },
    }))
  },

  addItem: (item) => {
    set((state) => {
      const existingIndex = state.player.inventory.findIndex(
        (i) => i.name.toLowerCase() === item.name.toLowerCase()
      )

      if (existingIndex >= 0) {
        // Item exists, update quantity
        const updatedInventory = [...state.player.inventory]
        updatedInventory[existingIndex] = {
          ...updatedInventory[existingIndex],
          quantity: updatedInventory[existingIndex].quantity + item.quantity,
        }
        return {
          player: {
            ...state.player,
            inventory: updatedInventory,
          },
        }
      } else {
        // New item, add to inventory
        return {
          player: {
            ...state.player,
            inventory: [...state.player.inventory, item],
          },
        }
      }
    })
  },

  removeItem: (name, quantity) => {
    set((state) => {
      const existingIndex = state.player.inventory.findIndex(
        (i) => i.name.toLowerCase() === name.toLowerCase()
      )

      if (existingIndex < 0) {
        // Item doesn't exist, nothing to remove
        return state
      }

      const updatedInventory = [...state.player.inventory]
      const currentItem = updatedInventory[existingIndex]

      if (quantity === undefined || quantity >= currentItem.quantity) {
        // Remove item entirely
        updatedInventory.splice(existingIndex, 1)
      } else {
        // Reduce quantity
        updatedInventory[existingIndex] = {
          ...currentItem,
          quantity: currentItem.quantity - quantity,
        }
      }

      return {
        player: {
          ...state.player,
          inventory: updatedInventory,
        },
      }
    })
  },

  updateItemQuantity: (name, quantity) => {
    set((state) => {
      const existingIndex = state.player.inventory.findIndex(
        (i) => i.name.toLowerCase() === name.toLowerCase()
      )

      if (existingIndex < 0) {
        return state
      }

      const updatedInventory = [...state.player.inventory]

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        updatedInventory.splice(existingIndex, 1)
      } else {
        updatedInventory[existingIndex] = {
          ...updatedInventory[existingIndex],
          quantity,
        }
      }

      return {
        player: {
          ...state.player,
          inventory: updatedInventory,
        },
      }
    })
  },

  applyInventoryChanges: (changes) => {
    const { addItem, removeItem } = get()

    // Process additions
    if (changes.add && Array.isArray(changes.add)) {
      changes.add.forEach((item) => {
        if (item.name) {
          addItem({
            name: item.name,
            description: item.description || '',
            quantity: item.quantity || 1,
          })
        }
      })
    }

    // Process removals
    if (changes.remove && Array.isArray(changes.remove)) {
      changes.remove.forEach((item) => {
        if (item.name) {
          removeItem(item.name, item.quantity)
        }
      })
    }
  },

  applyPlayerUpdates: (updates) => {
    const { setName } = get()

    if (updates.name && typeof updates.name === 'string') {
      setName(updates.name)
    }
  },
}))
