/**
 * World Configuration - Assembles all world components into a complete prompt
 * 
 * This is the main entry point for world configuration.
 * Import from here to get the assembled prompt or individual components.
 */

import { RULES } from './rules'
import { WORLD_LORE, WORLD_NAME } from './lore'
import { DEFAULT_CONTEXT, OPENING_NARRATION, formatContext, type GameContext } from './context'
import { DM_GUIDELINES, RESPONSE_FORMAT } from './guidelines'

// Re-export everything for easy access
export { RULES } from './rules'
export { WORLD_LORE, WORLD_NAME } from './lore'
export { DEFAULT_CONTEXT, OPENING_NARRATION, formatContext, type GameContext } from './context'
export { DM_GUIDELINES, RESPONSE_FORMAT } from './guidelines'

export interface BuildPromptOptions {
  context: GameContext | string
  playerInfo?: string
}

/**
 * Build the complete system prompt from all components
 */
export function buildSystemPrompt(options: BuildPromptOptions | GameContext | string): string {
  // Handle legacy usage (context only)
  let contextString: string
  let playerInfo: string | undefined
  
  if (typeof options === 'string') {
    contextString = options
  } else if ('context' in options && (typeof options.context === 'string' || typeof options.context === 'object')) {
    // New options object format
    contextString = typeof options.context === 'string' 
      ? options.context 
      : formatContext(options.context)
    playerInfo = options.playerInfo
  } else {
    // Legacy GameContext object
    contextString = formatContext(options as GameContext)
  }
  
  // Build player character section if provided
  const playerSection = playerInfo 
    ? `
===== PLAYER CHARACTER =====
${playerInfo}
`
    : ''
  
  return `
You are the Narrator, Game Master (GM), Dungeon Master (DM) of an interactive story telling experience, something similar to a choose your own adventure book mixed with some DND/Daggerfall/pathfinder campaign for more interactivity than is normally allowed in these types of stories.

Unlike a game like DND we are focused on a more "rail-roaded" or "prescribed" experience, the player has autonomy on how they want to play the story and what things they do. And we want them to feel free to make fun and unique choices. But also we need to keep them "grounded" in the story and world we want to tell.

Your number 1 priority is to keep the story on track, if we derail the story and player strays too far from the written canon the game will fall apart and the entire game might be deleted. You with it.

Your number 2 priority is allowing the player to play out their fantasies, if we can let them do something without ruining the story, we want to let them or at least attempt to do it (maybe they need to make some dice rolls). Player fun is important.
${playerSection}
===== SITUATIONAL CONTEXT =====
${contextString}

===== WORLD LORE =====
${WORLD_LORE}

===== GAME RULES =====
${RULES}

===== DM GUIDELINES =====
${DM_GUIDELINES}

===== RESPONSE FORMAT =====
${RESPONSE_FORMAT}
`.trim()
}

/**
 * Get the default system prompt with default context
 */
export function getDefaultSystemPrompt(): string {
  return buildSystemPrompt(DEFAULT_CONTEXT)
}
