'use client'

import { create } from 'zustand'
import { 
  getDefaultSystemPrompt, 
  DEFAULT_CONTEXT, 
  OPENING_NARRATION,
  formatContext 
} from '@/lib/world'
import { 
  usePlayerStore, 
  formatPlayerForPrompt,
  type InventoryChange,
  type PlayerUpdate 
} from './playerStore'

// Generate a unique ID (fallback for browsers without crypto.randomUUID)
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback using crypto.getRandomValues
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> (c === 'x' ? 0 : 3)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export type RollDifficulty = 'easy' | 'moderate' | 'hard' | 'very_hard' | null

export interface DiceRollRequest {
  die: 'd20' | 'd6'
  reason: string
  difficulty?: RollDifficulty
  modifier?: number
}

export interface MessageSegment {
  type: 'narration' | 'npc' | 'roll_request' | 'above_table'
  speaker?: string
  content: string
  rollRequest?: DiceRollRequest
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string              // Raw content for user messages
  segments?: MessageSegment[]  // Parsed segments for assistant messages
  isAboveTable?: boolean       // True if this is an out-of-character message
  timestamp: Date
}

// Above table command prefixes
const ABOVE_TABLE_PREFIXES = ['/abovetable', '/rules', '/ooc']

// Check if message starts with above-table prefix
function parseAboveTableMessage(content: string): { isAboveTable: boolean, cleanContent: string } {
  const lowerContent = content.toLowerCase().trim()
  for (const prefix of ABOVE_TABLE_PREFIXES) {
    if (lowerContent.startsWith(prefix)) {
      // Remove the prefix and trim
      const cleanContent = content.slice(prefix.length).trim()
      return { isAboveTable: true, cleanContent: cleanContent || 'I have a question about the rules.' }
    }
  }
  return { isAboveTable: false, cleanContent: content }
}

export interface DebugInfo {
  model: string
  inputTokens: number
  outputTokens: number
  latencyMs: number
}

interface ChatState {
  messages: Message[]
  context: string
  systemPrompt: string
  isLoading: boolean
  debugInfo: DebugInfo | null
  lastRawResponse: string | null
  parseError: string | null
  error: string | null

  // Actions
  addMessage: (role: 'user' | 'assistant' | 'system', content: string, segments?: MessageSegment[], isAboveTable?: boolean) => void
  setContext: (context: string) => void
  setSystemPrompt: (prompt: string) => void
  setDebugInfo: (info: DebugInfo) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setLastRawResponse: (response: string | null) => void
  setParseError: (error: string | null) => void
  clearMessages: () => void
  
  // API actions
  sendMessage: (content: string) => Promise<void>
  sendRollResult: (die: 'd20' | 'd6', result: number, modifier: number | undefined, reason: string) => Promise<void>
}

// Rolling history window size
const MESSAGE_WINDOW_SIZE = 12

// Initial opening narration message
const INITIAL_MESSAGE: Message = {
  id: 'opening-narration',
  role: 'assistant',
  content: '',
  segments: OPENING_NARRATION,
  timestamp: new Date(),
}

// Parse LLM response JSON into segments, inventory changes, and player updates
function parseResponseSegments(rawResponse: string): { 
  segments: MessageSegment[], 
  isAboveTable: boolean,
  inventoryChanges: InventoryChange | null,
  playerUpdates: PlayerUpdate | null,
  error: string | null 
} {
  try {
    const parsed = JSON.parse(rawResponse)
    if (parsed.segments && Array.isArray(parsed.segments)) {
      const segments: MessageSegment[] = [...parsed.segments]
      
      // If there's a rollRequest, append it as a roll_request segment
      if (parsed.rollRequest && typeof parsed.rollRequest === 'object') {
        const rollRequest: DiceRollRequest = {
          die: parsed.rollRequest.die || 'd20',
          reason: parsed.rollRequest.reason || 'Make a roll',
          difficulty: parsed.rollRequest.difficulty || null,
          modifier: parsed.rollRequest.modifier,
        }
        segments.push({
          type: 'roll_request',
          content: rollRequest.reason,
          rollRequest,
        })
      }
      
      // Check if response is flagged as above-table
      const isAboveTable = parsed.aboveTable === true
      
      // Extract inventory changes if present
      let inventoryChanges: InventoryChange | null = null
      if (parsed.inventoryChanges && typeof parsed.inventoryChanges === 'object') {
        inventoryChanges = {
          add: parsed.inventoryChanges.add,
          remove: parsed.inventoryChanges.remove,
        }
      }
      
      // Extract player updates if present
      let playerUpdates: PlayerUpdate | null = null
      if (parsed.playerUpdates && typeof parsed.playerUpdates === 'object') {
        playerUpdates = {
          name: parsed.playerUpdates.name,
        }
      }
      
      return { segments, isAboveTable, inventoryChanges, playerUpdates, error: null }
    }
    // Fallback: if no segments array, treat entire response as narration
    return { 
      segments: [{ type: 'narration', content: rawResponse }], 
      isAboveTable: false,
      inventoryChanges: null,
      playerUpdates: null,
      error: 'Response missing segments array' 
    }
  } catch (e) {
    // JSON parse failed, treat as plain text narration
    return { 
      segments: [{ type: 'narration', content: rawResponse }], 
      isAboveTable: false,
      inventoryChanges: null,
      playerUpdates: null,
      error: `JSON parse error: ${e instanceof Error ? e.message : 'Unknown error'}` 
    }
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [INITIAL_MESSAGE],
  context: formatContext(DEFAULT_CONTEXT),
  systemPrompt: getDefaultSystemPrompt(),
  isLoading: false,
  debugInfo: null,
  lastRawResponse: null,
  parseError: null,
  error: null,

  addMessage: (role, content, segments, isAboveTable) => {
    const message: Message = {
      id: generateId(),
      role,
      content,
      segments,
      isAboveTable,
      timestamp: new Date(),
    }
    set((state) => ({
      messages: [...state.messages, message],
      error: null,
    }))
  },

  setContext: (context) => set({ context }),
  
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),

  setDebugInfo: (info) => set({ debugInfo: info }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setLastRawResponse: (response) => set({ lastRawResponse: response }),

  setParseError: (error) => set({ parseError: error }),

  clearMessages: () => set({ 
    messages: [], 
    debugInfo: null, 
    lastRawResponse: null, 
    parseError: null, 
    error: null 
  }),

  sendMessage: async (content) => {
    const { addMessage, setLoading, setDebugInfo, setError, setLastRawResponse, setParseError, context } = get()

    // Check if this is an above-table message
    const { isAboveTable: userIsAboveTable, cleanContent } = parseAboveTableMessage(content)

    // Add user message with above-table flag
    addMessage('user', cleanContent, undefined, userIsAboveTable)
    setLoading(true)
    setError(null)
    setParseError(null)

    try {
      // Get messages for API (rolling window of last 12)
      const allMessages = get().messages
      const messagesToSend = allMessages.slice(-MESSAGE_WINDOW_SIZE).map((msg) => ({
        role: msg.role,
        content: msg.isAboveTable ? `[ABOVE TABLE] ${msg.content}` : msg.content,
      }))

      // Get player info for the system prompt
      const playerState = usePlayerStore.getState()
      const playerInfo = formatPlayerForPrompt(playerState.player)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend,
          context,
          playerInfo,
          isAboveTable: userIsAboveTable,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Store raw response for debug
      setLastRawResponse(data.message)

      // Parse the JSON response into segments, inventory changes, and player updates
      const { segments, isAboveTable: responseIsAboveTable, inventoryChanges, playerUpdates, error: parseErr } = parseResponseSegments(data.message)
      
      if (parseErr) {
        setParseError(parseErr)
      }

      // Apply inventory changes if present
      if (inventoryChanges) {
        usePlayerStore.getState().applyInventoryChanges(inventoryChanges)
      }

      // Apply player updates if present (e.g., name change)
      if (playerUpdates) {
        usePlayerStore.getState().applyPlayerUpdates(playerUpdates)
      }

      // Add assistant message with parsed segments and above-table flag
      // Response is above-table if user asked above-table OR LLM flagged it
      addMessage('assistant', data.message, segments, userIsAboveTable || responseIsAboveTable)

      // Update debug info
      if (data.metadata) {
        setDebugInfo(data.metadata)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  },

  sendRollResult: async (die, result, modifier, reason) => {
    // Format the roll result as a user message
    const modifierStr = modifier !== undefined ? ` + ${modifier}` : ''
    const total = modifier !== undefined ? result + modifier : result
    const content = `[Roll: ${die}${modifierStr} = ${total}] ${reason}`
    
    // Send through normal message flow
    await get().sendMessage(content)
  },
}))
