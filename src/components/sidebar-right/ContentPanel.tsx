'use client'

import type { RightSidebarTab } from '@/types'
import { useUIStore } from '@/stores/uiStore'
import { usePlayerStore } from '@/stores/playerStore'

/**
 * Format a stat modifier for display (e.g., +2 or -1)
 */
function formatModifier(value: number): string {
  if (value >= 0) {
    return `+${value}`
  }
  return `${value}`
}

function CharacterContent() {
  const { player } = usePlayerStore()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Character Sheet</h2>
      
      {/* Basic Info */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Identity</h3>
        <div className="space-y-2 text-sm text-zinc-400">
          {player.name ? (
            <p><span className="text-zinc-500">Name:</span> {player.name}</p>
          ) : (
            <p className="italic text-zinc-500">Name not yet chosen...</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded bg-zinc-700/50 p-3 text-center">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Strength</p>
            <p className="text-xl font-bold text-zinc-200">{formatModifier(player.stats.strength)}</p>
          </div>
          <div className="rounded bg-zinc-700/50 p-3 text-center">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Speed</p>
            <p className="text-xl font-bold text-zinc-200">{formatModifier(player.stats.speed)}</p>
          </div>
          <div className="rounded bg-zinc-700/50 p-3 text-center">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Knowledge</p>
            <p className="text-xl font-bold text-zinc-200">{formatModifier(player.stats.knowledge)}</p>
          </div>
          <div className="rounded bg-zinc-700/50 p-3 text-center">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Presence</p>
            <p className="text-xl font-bold text-zinc-200">{formatModifier(player.stats.presence)}</p>
          </div>
        </div>
      </div>

      {/* Traits */}
      {player.traits.length > 0 && (
        <div className="rounded-lg bg-zinc-800/50 p-4">
          <h3 className="mb-2 text-sm font-medium text-zinc-300">Traits</h3>
          <div className="space-y-3">
            {player.traits.map((trait, index) => (
              <div key={index} className="rounded bg-zinc-700/30 p-3">
                <p className="font-medium text-indigo-400">{trait.name}</p>
                <p className="mt-1 text-xs text-zinc-400">{trait.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Inventory Summary */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Inventory Summary</h3>
        <p className="text-sm text-zinc-400">
          {player.inventory.length} item{player.inventory.length !== 1 ? 's' : ''} carried
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          See the Inventory tab for details
        </p>
      </div>
    </div>
  )
}

function InventoryContent() {
  const { player } = usePlayerStore()

  // Group items by category for better organization
  const currencyItems = player.inventory.filter(item => 
    item.name.toLowerCase().includes('coin') || 
    item.name.toLowerCase().includes('gold') ||
    item.name.toLowerCase().includes('silver') ||
    item.name.toLowerCase().includes('copper')
  )
  const otherItems = player.inventory.filter(item => 
    !item.name.toLowerCase().includes('coin') && 
    !item.name.toLowerCase().includes('gold') &&
    !item.name.toLowerCase().includes('silver') &&
    !item.name.toLowerCase().includes('copper')
  )

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Inventory</h2>
      
      {/* Currency */}
      {currencyItems.length > 0 && (
        <div className="rounded-lg bg-zinc-800/50 p-4">
          <h3 className="mb-2 text-sm font-medium text-zinc-300">Currency</h3>
          <div className="flex flex-wrap gap-2">
            {currencyItems.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 rounded bg-amber-900/30 px-3 py-1.5"
              >
                <span className="text-amber-400">●</span>
                <span className="text-sm font-medium text-amber-200">
                  {item.quantity} {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Items</h3>
        {otherItems.length > 0 ? (
          <div className="space-y-2">
            {otherItems.map((item, index) => (
              <div 
                key={index} 
                className="rounded bg-zinc-700/30 p-3"
              >
                <div className="flex items-start justify-between">
                  <p className="font-medium text-zinc-200">{item.name}</p>
                  {item.quantity > 1 && (
                    <span className="ml-2 rounded bg-zinc-600/50 px-2 py-0.5 text-xs text-zinc-300">
                      x{item.quantity}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1 text-xs text-zinc-400">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No items in inventory</p>
        )}
      </div>

      {/* Total count */}
      <div className="rounded-lg bg-zinc-800/30 p-3 text-center">
        <p className="text-xs text-zinc-500">
          {player.inventory.length} total item type{player.inventory.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}

function RulesContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">How to Play</h2>
      
      {/* Introduction */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <p className="text-sm leading-relaxed text-zinc-300">
          This is a narrative-first RPG. Describe what your character attempts, 
          and the Game Master will determine what happens. Sometimes you&apos;ll need 
          to roll dice when the outcome is uncertain.
        </p>
      </div>

      {/* Your Stats */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-indigo-400">Your Stats</h3>
        <p className="mb-3 text-xs text-zinc-400">
          Your character has four core stats that add bonuses to your rolls:
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium text-zinc-200">Strength</span>
            <span className="text-zinc-400">— Physical power, melee combat, breaking things</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-zinc-200">Speed</span>
            <span className="text-zinc-400">— Agility, reflexes, dodging, stealth</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-zinc-200">Knowledge</span>
            <span className="text-zinc-400">— Lore, reasoning, noticing details, magic</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-zinc-200">Presence</span>
            <span className="text-zinc-400">— Charisma, persuasion, intimidation, leadership</span>
          </div>
        </div>
      </div>

      {/* Rolling Dice */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-indigo-400">Rolling Dice</h3>
        <p className="mb-3 text-xs text-zinc-400">
          When you attempt something risky or uncertain, you&apos;ll roll a d20 
          (20-sided die) and add your relevant stat bonus.
        </p>
        <div className="rounded bg-zinc-700/30 p-3">
          <p className="text-center font-mono text-zinc-200">
            d20 + stat bonus = your result
          </p>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          The Game Master sets a difficulty. Beat it and you succeed!
        </p>
      </div>

      {/* Difficulty */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-indigo-400">Difficulty Levels</h3>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-emerald-400">Easy</span>
            <span className="text-zinc-500">DC 5-10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-400">Moderate</span>
            <span className="text-zinc-500">DC 11-15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-400">Hard</span>
            <span className="text-zinc-500">DC 16-20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-400">Very Hard</span>
            <span className="text-zinc-500">DC 21+</span>
          </div>
        </div>
      </div>

      {/* Success & Failure */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-indigo-400">Success & Failure</h3>
        <div className="space-y-2 text-xs text-zinc-400">
          <p>
            <span className="font-medium text-emerald-400">Big Success:</span>{' '}
            Beat the DC by 5+ for extra benefits or advantages.
          </p>
          <p>
            <span className="font-medium text-zinc-300">Success:</span>{' '}
            Meet or beat the DC to accomplish your goal.
          </p>
          <p>
            <span className="font-medium text-amber-400">Partial Failure:</span>{' '}
            Miss by a little? Something happens, but not what you wanted.
          </p>
          <p>
            <span className="font-medium text-red-400">Failure:</span>{' '}
            Miss by a lot and things might get worse.
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-indigo-400">Items & Inventory</h3>
        <p className="text-xs text-zinc-400">
          You can only use items you actually have. When you find, buy, or 
          receive items, they&apos;ll be added to your inventory. Using consumables 
          (like potions) removes them. Keep track of what you&apos;re carrying!
        </p>
      </div>

      {/* Tips */}
      <div className="rounded-lg bg-indigo-900/30 p-4">
        <h3 className="mb-2 text-sm font-medium text-indigo-300">Tips for Playing</h3>
        <ul className="space-y-1.5 text-xs text-indigo-200/80">
          <li>• Describe what you <em>attempt</em>, not what happens</li>
          <li>• Be creative! There&apos;s often more than one solution</li>
          <li>• Talking to NPCs often requires Presence checks</li>
          <li>• Type <code className="rounded bg-indigo-800/50 px-1">/rules</code> to ask the GM about mechanics</li>
          <li>• Failure isn&apos;t the end—it&apos;s a twist in the story</li>
        </ul>
      </div>
    </div>
  )
}

function DebugContent() {
  // Import chat store dynamically to avoid circular deps
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useChatStore } = require('@/stores/chatStore')
  const { messages, context, systemPrompt, debugInfo, lastRawResponse, parseError } = useChatStore()

  // Parse last response for segment breakdown
  const getSegmentBreakdown = () => {
    if (!lastRawResponse) return null
    try {
      const parsed = JSON.parse(lastRawResponse)
      if (parsed.segments && Array.isArray(parsed.segments)) {
        const narrationCount = parsed.segments.filter((s: { type: string }) => s.type === 'narration').length
        const npcCount = parsed.segments.filter((s: { type: string }) => s.type === 'npc').length
        return { total: parsed.segments.length, narrationCount, npcCount }
      }
      return null
    } catch {
      return null
    }
  }

  const segmentBreakdown = getSegmentBreakdown()

  // Format raw JSON for display
  const formatRawResponse = () => {
    if (!lastRawResponse) return null
    try {
      return JSON.stringify(JSON.parse(lastRawResponse), null, 2)
    } catch {
      return lastRawResponse
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Debug Panel</h2>
      
      {/* System Prompt */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">System Prompt</h3>
        <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap text-xs text-zinc-400">
          {systemPrompt || 'Not set'}
        </pre>
      </div>

      {/* Context */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Situational Context</h3>
        <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap text-xs text-zinc-400">
          {context || 'No context set'}
        </pre>
      </div>

      {/* Message Stats */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Messages</h3>
        <div className="space-y-1 text-sm text-zinc-400">
          <p><span className="text-zinc-500">Total messages:</span> {messages.length}</p>
          <p><span className="text-zinc-500">Rolling window:</span> Last 12 sent to API</p>
        </div>
      </div>

      {/* Last Request Metadata */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Last Request</h3>
        {debugInfo ? (
          <div className="space-y-1 text-sm text-zinc-400">
            <p><span className="text-zinc-500">Model:</span> {debugInfo.model}</p>
            <p><span className="text-zinc-500">Input tokens:</span> {debugInfo.inputTokens}</p>
            <p><span className="text-zinc-500">Output tokens:</span> {debugInfo.outputTokens}</p>
            <p><span className="text-zinc-500">Latency:</span> {debugInfo.latencyMs}ms</p>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">No requests made yet</p>
        )}
      </div>

      {/* Last Response */}
      <div className="rounded-lg bg-zinc-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-300">Last Response</h3>
        {lastRawResponse ? (
          <>
            {/* Segment breakdown */}
            {segmentBreakdown && (
              <p className="mb-2 text-xs text-zinc-500">
                Segments: {segmentBreakdown.total} (narration: {segmentBreakdown.narrationCount}, npc: {segmentBreakdown.npcCount})
              </p>
            )}
            
            {/* Parse error warning */}
            {parseError && (
              <div className="mb-2 rounded bg-amber-900/50 px-2 py-1 text-xs text-amber-300">
                Parse warning: {parseError}
              </div>
            )}
            
            {/* Raw JSON */}
            <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap text-xs text-zinc-400">
              {formatRawResponse()}
            </pre>
          </>
        ) : (
          <p className="text-sm text-zinc-400">No response yet</p>
        )}
      </div>
    </div>
  )
}

const contentComponents: Record<RightSidebarTab, React.ComponentType> = {
  character: CharacterContent,
  inventory: InventoryContent,
  rules: RulesContent,
  debug: DebugContent,
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
