'use client'

import type { RightSidebarTab } from '@/types'
import { useUIStore } from '@/stores/uiStore'

function CharacterContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Character Sheet</h2>
      
      {/* Basic Info */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Basic Info</h3>
        <div className="space-y-2 text-sm text-zinc-400">
          <p><span className="text-zinc-500">Name:</span> Adventurer</p>
          <p><span className="text-zinc-500">Class:</span> Fighter</p>
          <p><span className="text-zinc-500">Level:</span> 5</p>
          <p><span className="text-zinc-500">Race:</span> Human</p>
          <p><span className="text-zinc-500">Background:</span> Soldier</p>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Ability Scores</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded bg-zinc-700/50 p-2 text-center">
            <p className="text-zinc-500">STR</p>
            <p className="text-lg font-bold text-zinc-200">16</p>
            <p className="text-xs text-zinc-400">+3</p>
          </div>
          <div className="rounded bg-zinc-700/50 p-2 text-center">
            <p className="text-zinc-500">DEX</p>
            <p className="text-lg font-bold text-zinc-200">14</p>
            <p className="text-xs text-zinc-400">+2</p>
          </div>
          <div className="rounded bg-zinc-700/50 p-2 text-center">
            <p className="text-zinc-500">CON</p>
            <p className="text-lg font-bold text-zinc-200">15</p>
            <p className="text-xs text-zinc-400">+2</p>
          </div>
          <div className="rounded bg-zinc-700/50 p-2 text-center">
            <p className="text-zinc-500">INT</p>
            <p className="text-lg font-bold text-zinc-200">10</p>
            <p className="text-xs text-zinc-400">+0</p>
          </div>
          <div className="rounded bg-zinc-700/50 p-2 text-center">
            <p className="text-zinc-500">WIS</p>
            <p className="text-lg font-bold text-zinc-200">12</p>
            <p className="text-xs text-zinc-400">+1</p>
          </div>
          <div className="rounded bg-zinc-700/50 p-2 text-center">
            <p className="text-zinc-500">CHA</p>
            <p className="text-lg font-bold text-zinc-200">8</p>
            <p className="text-xs text-zinc-400">-1</p>
          </div>
        </div>
      </div>

      {/* Combat Stats */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Combat</h3>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="rounded bg-zinc-700/50 p-2 text-center">
            <p className="text-zinc-500">AC</p>
            <p className="text-lg font-bold text-zinc-200">18</p>
          </div>
          <div className="rounded bg-zinc-700/50 p-2 text-center">
            <p className="text-zinc-500">HP</p>
            <p className="text-lg font-bold text-zinc-200">45</p>
          </div>
          <div className="rounded bg-zinc-700/50 p-2 text-center">
            <p className="text-zinc-500">Speed</p>
            <p className="text-lg font-bold text-zinc-200">30</p>
          </div>
        </div>
      </div>

      {/* Saving Throws */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Saving Throws</h3>
        <div className="space-y-1 text-sm text-zinc-400">
          <p><span className="text-indigo-400">●</span> Strength: +6</p>
          <p><span className="text-indigo-400">●</span> Constitution: +5</p>
          <p><span className="text-zinc-600">○</span> Dexterity: +2</p>
          <p><span className="text-zinc-600">○</span> Intelligence: +0</p>
          <p><span className="text-zinc-600">○</span> Wisdom: +1</p>
          <p><span className="text-zinc-600">○</span> Charisma: -1</p>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Skills</h3>
        <div className="space-y-1 text-sm text-zinc-400">
          <p><span className="text-zinc-600">○</span> Acrobatics: +2</p>
          <p><span className="text-zinc-600">○</span> Animal Handling: +1</p>
          <p><span className="text-zinc-600">○</span> Arcana: +0</p>
          <p><span className="text-indigo-400">●</span> Athletics: +6</p>
          <p><span className="text-zinc-600">○</span> Deception: -1</p>
          <p><span className="text-zinc-600">○</span> History: +0</p>
          <p><span className="text-zinc-600">○</span> Insight: +1</p>
          <p><span className="text-indigo-400">●</span> Intimidation: +2</p>
          <p><span className="text-zinc-600">○</span> Investigation: +0</p>
          <p><span className="text-zinc-600">○</span> Medicine: +1</p>
          <p><span className="text-zinc-600">○</span> Nature: +0</p>
          <p><span className="text-indigo-400">●</span> Perception: +4</p>
          <p><span className="text-zinc-600">○</span> Performance: -1</p>
          <p><span className="text-zinc-600">○</span> Persuasion: -1</p>
          <p><span className="text-zinc-600">○</span> Religion: +0</p>
          <p><span className="text-zinc-600">○</span> Sleight of Hand: +2</p>
          <p><span className="text-zinc-600">○</span> Stealth: +2</p>
          <p><span className="text-indigo-400">●</span> Survival: +4</p>
        </div>
      </div>

      {/* Features */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Features & Traits</h3>
        <div className="space-y-2 text-sm text-zinc-400">
          <div>
            <p className="font-medium text-zinc-300">Fighting Style: Defense</p>
            <p className="text-xs">+1 bonus to AC when wearing armor.</p>
          </div>
          <div>
            <p className="font-medium text-zinc-300">Second Wind</p>
            <p className="text-xs">Regain 1d10 + fighter level HP as a bonus action.</p>
          </div>
          <div>
            <p className="font-medium text-zinc-300">Action Surge</p>
            <p className="text-xs">Take one additional action on your turn.</p>
          </div>
          <div>
            <p className="font-medium text-zinc-300">Extra Attack</p>
            <p className="text-xs">Attack twice when taking the Attack action.</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Notes</h3>
        <p className="text-sm text-zinc-400">
          A veteran soldier who now seeks adventure. Loyal to companions and always ready for battle.
          Currently on a quest to retrieve the stolen artifact from the Shadowfell.
        </p>
      </div>
    </div>
  )
}

function InventoryContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Inventory</h2>
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <p className="text-sm text-zinc-400">Your items and equipment will appear here.</p>
      </div>
    </div>
  )
}

function SpellsContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Spells</h2>
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <p className="text-sm text-zinc-400">Your known spells and abilities will appear here.</p>
      </div>
    </div>
  )
}

function RulesContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Rules Reference</h2>
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <p className="text-sm text-zinc-400">Game rules and reference materials will appear here.</p>
      </div>
    </div>
  )
}

const contentComponents: Record<RightSidebarTab, React.ComponentType> = {
  character: CharacterContent,
  inventory: InventoryContent,
  spells: SpellsContent,
  rules: RulesContent,
}

export function ContentPanel() {
  const { rightSidebar } = useUIStore()
  const { activeTab } = rightSidebar

  const Content = contentComponents[activeTab]

  return (
    <div className="h-full min-h-0 overflow-y-auto p-4 pt-16">
      <Content />
    </div>
  )
}
