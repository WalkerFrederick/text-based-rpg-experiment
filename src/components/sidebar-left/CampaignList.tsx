'use client'

import { CampaignCard } from './CampaignCard'
import type { Campaign } from '@/types'

interface CampaignListProps {
  campaigns: Campaign[]
  activeCampaignId?: string
  onCampaignSelect?: (campaign: Campaign) => void
  onCampaignSettings?: (campaign: Campaign) => void
}

// Mock data for prototype
const mockCampaigns: Campaign[] = [
  { id: '1', title: 'Dragon\'s Lair', characterName: 'Thorin Ironforge', level: 12 },
  { id: '2', title: 'Curse of Strahd', characterName: 'Elena Shadowmend', level: 8 },
  { id: '3', title: 'Lost Mines of Phandelver', characterName: 'Grok the Mighty', level: 4 },
  { id: '4', title: 'Tomb of Annihilation', characterName: 'Zara Sunweaver', level: 9 },
  { id: '5', title: 'Storm King\'s Thunder', characterName: 'Bjorn Stormcaller', level: 11 },
  { id: '6', title: 'Waterdeep Heist', characterName: 'Silky Fingers', level: 6 },
  { id: '7', title: 'Descent into Avernus', characterName: 'Kira Dawnblade', level: 13 },
  { id: '8', title: 'Rime of the Frostmaiden', characterName: 'Yuki Frostwhisper', level: 7 },
  { id: '9', title: 'Wild Beyond Witchlight', characterName: 'Pip Merryweather', level: 5 },
  { id: '10', title: 'Ghosts of Saltmarsh', characterName: 'Captain Redbane', level: 8 },
  { id: '11', title: 'Princes of the Apocalypse', characterName: 'Terra Stoneheart', level: 10 },
  { id: '12', title: 'Out of the Abyss', characterName: 'Vex Shadowcloak', level: 14 },
  { id: '13', title: 'Hoard of the Dragon Queen', characterName: 'Aldric Flameguard', level: 6 },
  { id: '14', title: 'Rise of Tiamat', characterName: 'Seraphina Lightbringer', level: 15 },
  { id: '15', title: 'Tales from Yawning Portal', characterName: 'Dunric Ironhide', level: 3 },
  { id: '16', title: 'Candlekeep Mysteries', characterName: 'Sage Thornwick', level: 7 },
  { id: '17', title: 'Vecna Lives!', characterName: 'Mortis Darkhollow', level: 18 },
  { id: '18', title: 'Against the Giants', characterName: 'Brutus Thunderfist', level: 11 },
  { id: '19', title: 'Temple of Elemental Evil', characterName: 'Aria Windwalker', level: 9 },
  { id: '20', title: 'Ravenloft: Mist Hunters', characterName: 'Viktor Graveson', level: 10 },
  { id: '21', title: 'Spelljammer Adventures', characterName: 'Nova Stardust', level: 8 },
  { id: '22', title: 'Planescape: Sigil Stories', characterName: 'Cipher the Lost', level: 12 },
  { id: '23', title: 'Eberron: Last War', characterName: 'Forge Unit-7', level: 6 },
]

export function CampaignList({
  campaigns = mockCampaigns,
  activeCampaignId,
  onCampaignSelect,
  onCampaignSettings,
}: CampaignListProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="px-1 text-sm font-medium text-zinc-400">Your Campaigns</h2>
      <div className="flex flex-col gap-2">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            isActive={campaign.id === activeCampaignId}
            onClick={() => onCampaignSelect?.(campaign)}
            onSettingsClick={() => onCampaignSettings?.(campaign)}
          />
        ))}
      </div>
    </div>
  )
}
