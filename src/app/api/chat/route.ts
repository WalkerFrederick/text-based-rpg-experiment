import { NextResponse } from 'next/server'
import { chatGraph, toLangChainMessages } from '@/lib/graph/chatGraph'
import { buildSystemPrompt } from '@/lib/world'

export interface ChatRequestBody {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  context: string
  playerInfo?: string
  isAboveTable?: boolean
}

export interface ChatResponseBody {
  message: string
  metadata: {
    model: string
    inputTokens: number
    outputTokens: number
    latencyMs: number
  } | null
}

export async function POST(request: Request) {
  try {
    const body: ChatRequestBody = await request.json()
    const { messages, context, playerInfo, isAboveTable } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Build system prompt with player info
    const systemPrompt = buildSystemPrompt({
      context: context || '',
      playerInfo: playerInfo,
    })

    // Convert to LangChain message format
    const langChainMessages = toLangChainMessages(messages)

    // Run the graph
    const result = await chatGraph.invoke({
      messages: langChainMessages,
      context: context || '',
      systemPrompt: systemPrompt,
      response: null,
      metadata: null,
      isAboveTable: isAboveTable || false,
    })

    const response: ChatResponseBody = {
      message: result.response || '',
      metadata: result.metadata,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
