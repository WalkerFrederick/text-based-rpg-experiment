'use client'

import { cn } from '@/lib/utils'

export interface CommandPill {
  id: string
  label: string
  command: string  // The actual command to prepend (e.g., "/rules")
}

interface SuggestionPillsProps {
  commands?: CommandPill[]
  onCommandSelect?: (command: string) => void
}

const defaultCommands: CommandPill[] = [
  { id: 'rules', label: '/rules', command: '/rules ' },
  { id: 'abovetable', label: '/abovetable', command: '/abovetable ' },
  { id: 'ooc', label: '/ooc', command: '/ooc ' },
]

export function SuggestionPills({
  commands = defaultCommands,
  onCommandSelect,
}: SuggestionPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 pb-1 pt-2">
      {commands.map((cmd) => (
        <button
          key={cmd.id}
          onClick={() => onCommandSelect?.(cmd.command)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium',
            'bg-cyan-900/40 text-cyan-400',
            'border border-cyan-700/50',
            'hover:bg-cyan-800/50 hover:text-cyan-300',
            'transition-colors duration-150'
          )}
        >
          {cmd.label}
        </button>
      ))}
    </div>
  )
}
