'use client'

import { cn } from '@/lib/utils'

interface SuggestionPill {
  id: string
  label: string
}

interface SuggestionPillsProps {
  suggestions?: SuggestionPill[]
  onSelect?: (suggestion: SuggestionPill) => void
}

const defaultSuggestions: SuggestionPill[] = [
  { id: 'adventure', label: 'adventure' },
  { id: 'rules', label: 'rules' },
  { id: 'suggestions', label: 'suggestions' },
]

export function SuggestionPills({
  suggestions = defaultSuggestions,
  onSelect,
}: SuggestionPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 pb-1 pt-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          onClick={() => onSelect?.(suggestion)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium',
            'bg-zinc-800/60 text-zinc-400',
            'border border-zinc-700/50',
            'hover:bg-zinc-700/60 hover:text-zinc-300',
            'transition-colors duration-150'
          )}
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  )
}
