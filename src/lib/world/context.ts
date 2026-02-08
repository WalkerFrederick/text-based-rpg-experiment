/**
 * Situational Context - The current state of the game
 * This is the dynamic, changing context that gets updated as the game progresses
 */

import type { MessageSegment } from '@/stores/chatStore'

export interface GameContext {
  /** Current location of the player */
  location: string
  /** Time of day */
  timeOfDay: 'dawn' | 'morning' | 'midday' | 'afternoon' | 'dusk' | 'evening' | 'night' | 'midnight'
  /** Current situation summary */
  situation: string
  /** Active quests or objectives */
  activeQuests: string[]
  /** Known NPCs and their dispositions */
  knownNPCs: Record<string, string>
  /** Player inventory highlights */
  inventory: string[]
  /** Any active conditions or effects */
  conditions: string[]
}

/** Default starting context */
export const DEFAULT_CONTEXT: GameContext = {
  location: 'The Clearing',
  timeOfDay: 'dawn',
  situation: 'The player has just woken in the Clearing with no memory of how they arrived. Two other survivors—Mara and Jonah—are nearby. The stone walls surrounding the Clearing have begun to open, revealing the maze beyond. A third survivor, Eli, disappeared into the maze three days ago and has not returned.',
  activeQuests: [],
  knownNPCs: {
    'Mara': 'Guarded but not hostile. Believes in strict rationing and caution.',
    'Jonah': 'Curious and impulsive. Eager to explore deeper into the maze.',
  },
  inventory: [],
  conditions: ['Confused', 'No memories of before the Clearing'],
}

/** Convert context object to a string for the prompt */
export function formatContext(context: GameContext): string {
  const lines: string[] = []
  
  lines.push(`CURRENT LOCATION: ${context.location}`)
  lines.push(`TIME: ${context.timeOfDay}`)
  lines.push(``)
  lines.push(`SITUATION: ${context.situation}`)
  
  if (context.activeQuests.length > 0) {
    lines.push(``)
    lines.push(`ACTIVE QUESTS:`)
    context.activeQuests.forEach(q => lines.push(`- ${q}`))
  }
  
  if (Object.keys(context.knownNPCs).length > 0) {
    lines.push(``)
    lines.push(`KNOWN NPCS:`)
    Object.entries(context.knownNPCs).forEach(([name, disposition]) => {
      lines.push(`- ${name}: ${disposition}`)
    })
  }
  
  if (context.inventory.length > 0) {
    lines.push(``)
    lines.push(`NOTABLE INVENTORY:`)
    context.inventory.forEach(item => lines.push(`- ${item}`))
  }
  
  if (context.conditions.length > 0) {
    lines.push(``)
    lines.push(`ACTIVE CONDITIONS:`)
    context.conditions.forEach(c => lines.push(`- ${c}`))
  }
  
  return lines.join('\n')
}

/** Opening narration segments for a new game */
export const OPENING_NARRATION: MessageSegment[] = [
  {
    type: 'narration',
    content: 'Cold grass presses against your back. Your eyes open to a pale sky—distant, still, like a painting that forgot to move. You don\'t remember falling asleep. You don\'t remember arriving. You don\'t remember... anything.',
  },
  {
    type: 'narration',
    content: 'You sit up slowly. A wide, circular field stretches around you, ringed by impossibly high stone walls. Vines crawl along the stone like veins. There are no doors. No cracks. No way out that you can see.',
  },
  {
    type: 'narration',
    content: 'Two figures crouch near a small fire at the center of the Clearing. One—a woman with sharp eyes and a guarded posture—watches you rise. The other, a younger man with restless hands, looks toward the walls with something like hunger.',
  },
  {
    type: 'narration',
    content: 'A low, grinding sound echoes across the field. The walls are moving. Slowly, sections of stone slide apart, revealing narrow corridors beyond—a maze, unfolding in the morning light.',
  },
  {
    type: 'npc',
    speaker: 'Mara',
    content: 'She stands, brushing dirt from her knees. "Another one." Her voice is flat, unsurprised. "You don\'t remember anything. None of us do. Don\'t waste time trying." She gestures toward the opening walls. "The maze is open. If you want to eat, you\'ll have to go in. If you want to live, you\'ll come back before dark."',
  },
]
