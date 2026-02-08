/**
 * @deprecated Use the modular world configuration at @/lib/world instead
 * This file is kept for backwards compatibility
 */

import { getDefaultSystemPrompt, buildSystemPrompt as buildPrompt } from '@/lib/world'

// Re-export for backwards compatibility
export const SYSTEM_PROMPT = getDefaultSystemPrompt()

export function buildSystemPrompt(context: string): string {
  return buildPrompt(context)
}
