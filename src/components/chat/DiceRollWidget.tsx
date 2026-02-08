'use client'

import { Dices } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore, type DiceRollRequest, type RollDifficulty } from '@/stores/chatStore'

interface DiceRollWidgetProps {
  rollRequest: DiceRollRequest
}

// Get styling and DC range based on difficulty
function getDifficultyStyles(difficulty: RollDifficulty | undefined): {
  border: string
  bg: string
  accent: string
  label: string
  dcRange: string
} {
  switch (difficulty) {
    case 'easy':
      return {
        border: 'border-emerald-500/50',
        bg: 'bg-emerald-500/10',
        accent: 'text-emerald-400',
        label: 'Easy',
        dcRange: 'DC 5-10',
      }
    case 'moderate':
      return {
        border: 'border-amber-500/50',
        bg: 'bg-amber-500/10',
        accent: 'text-amber-400',
        label: 'Moderate',
        dcRange: 'DC 11-15',
      }
    case 'hard':
      return {
        border: 'border-orange-500/50',
        bg: 'bg-orange-500/10',
        accent: 'text-orange-400',
        label: 'Hard',
        dcRange: 'DC 16-20',
      }
    case 'very_hard':
      return {
        border: 'border-red-500/50',
        bg: 'bg-red-500/10',
        accent: 'text-red-400',
        label: 'Very Hard',
        dcRange: 'DC 21+',
      }
    default:
      // Neutral styling for damage/healing rolls
      return {
        border: 'border-indigo-500/50',
        bg: 'bg-indigo-500/10',
        accent: 'text-indigo-400',
        label: '',
        dcRange: '',
      }
  }
}

// Generate random roll result
function rollDie(die: 'd20' | 'd6'): number {
  const max = die === 'd20' ? 20 : 6
  return Math.floor(Math.random() * max) + 1
}

export function DiceRollWidget({ rollRequest }: DiceRollWidgetProps) {
  const { sendRollResult, isLoading } = useChatStore()
  const styles = getDifficultyStyles(rollRequest.difficulty)

  const handleRoll = async () => {
    const result = rollDie(rollRequest.die)
    await sendRollResult(
      rollRequest.die,
      result,
      rollRequest.modifier,
      rollRequest.reason
    )
  }

  const modifierDisplay = rollRequest.modifier !== undefined
    ? (rollRequest.modifier >= 0 ? `+${rollRequest.modifier}` : `${rollRequest.modifier}`)
    : null

  return (
    <div className="flex w-full justify-start">
      <div
        className={cn(
          'max-w-[85%] rounded-2xl border-2 px-4 py-3',
          styles.border,
          styles.bg
        )}
      >
        {/* Difficulty label and DC if present */}
        {styles.label && (
          <div className="mb-1 flex items-center gap-2">
            <span className={cn('text-xs font-semibold uppercase tracking-wide', styles.accent)}>
              {styles.label}
            </span>
            <span className="text-xs text-zinc-500">
              {styles.dcRange}
            </span>
          </div>
        )}

        {/* Reason for the roll */}
        <p className="mb-3 text-sm text-zinc-100">{rollRequest.reason}</p>

        {/* Roll button */}
        <button
          onClick={handleRoll}
          disabled={isLoading}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all',
            'bg-zinc-700/80 hover:bg-zinc-600/80',
            'disabled:cursor-not-allowed disabled:opacity-50',
            styles.accent
          )}
        >
          <Dices className="h-5 w-5" />
          <span>
            Roll {rollRequest.die.toUpperCase()}
            {modifierDisplay && <span className="ml-1 text-zinc-400">({modifierDisplay})</span>}
          </span>
        </button>
      </div>
    </div>
  )
}
