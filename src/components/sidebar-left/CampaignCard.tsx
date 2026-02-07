'use client'

import { Settings } from 'lucide-react'
import type { Campaign } from '@/types'
import { cn } from '@/lib/utils'

interface CampaignCardProps {
  campaign: Campaign
  isActive?: boolean
  onClick?: () => void
  onSettingsClick?: () => void
}

export function CampaignCard({
  campaign,
  isActive = false,
  onClick,
  onSettingsClick,
}: CampaignCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex cursor-pointer flex-col gap-1 rounded-lg p-3',
        'bg-zinc-800/50 hover:bg-zinc-700/60',
        'border border-transparent transition-all duration-150',
        isActive && 'border-indigo-500/50 bg-zinc-700/60'
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-zinc-100">{campaign.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSettingsClick?.()
          }}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded',
            'text-zinc-500 hover:bg-zinc-600 hover:text-zinc-300',
            'opacity-0 transition-opacity group-hover:opacity-100'
          )}
          aria-label="Campaign settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-zinc-400">
        {campaign.characterName} - Level {campaign.level}
      </p>
    </div>
  )
}
