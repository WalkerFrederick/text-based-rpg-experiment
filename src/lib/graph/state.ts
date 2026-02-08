'use server'

import { BaseMessage } from '@langchain/core/messages'

export interface ChatMetadata {
  model: string
  inputTokens: number
  outputTokens: number
  latencyMs: number
}

export interface ChatGraphState {
  messages: BaseMessage[]
  context: string
  systemPrompt: string
  response: string | null
  metadata: ChatMetadata | null
}

// Initial state factory
export function createInitialState(
  messages: BaseMessage[],
  context: string,
  systemPrompt: string
): ChatGraphState {
  return {
    messages,
    context,
    systemPrompt,
    response: null,
    metadata: null,
  }
}
