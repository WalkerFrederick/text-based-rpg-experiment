'use client'

import { useRef } from 'react'
import { useChatStore, type MessageSegment, type Message } from '@/stores/chatStore'
import { SuggestionPills } from './SuggestionPills'
import { ChatInput, type ChatInputHandle } from './ChatInput'
import { DiceRollWidget } from './DiceRollWidget'
import { Loader2 } from 'lucide-react'

// User message bubble
function UserMessage({ content, isAboveTable }: { content: string; isAboveTable?: boolean }) {
  if (isAboveTable) {
    return (
      <div className="flex w-full justify-end">
        <div className="max-w-[85%] rounded-2xl border-2 border-dashed border-cyan-500/50 bg-cyan-950/30 px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-400">
            Above Table
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-cyan-100">{content}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex w-full justify-end">
      <div className="max-w-[85%] rounded-2xl bg-indigo-600 px-4 py-3 text-white">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

// Narration segment bubble (no header)
function NarrationBubble({ content }: { content: string }) {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[85%] rounded-2xl bg-zinc-800/80 px-4 py-3">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">{content}</p>
      </div>
    </div>
  )
}

// Above table segment bubble (out-of-character DM response)
function AboveTableBubble({ content }: { content: string }) {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[85%] rounded-2xl border-2 border-dashed border-cyan-500/50 bg-cyan-950/30 px-4 py-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-400">
          Above Table
        </p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-cyan-100">{content}</p>
      </div>
    </div>
  )
}

// NPC segment bubble (with name header)
function NPCBubble({ speaker, content }: { speaker: string; content: string }) {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[85%] rounded-2xl bg-zinc-800/80 px-4 py-3">
        <p className="mb-1 text-xs font-semibold text-indigo-400">{speaker}</p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">{content}</p>
      </div>
    </div>
  )
}

// Render assistant message with segments
function AssistantMessage({ segments, isAboveTable }: { segments: MessageSegment[]; isAboveTable?: boolean }) {
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'roll_request' && seg.rollRequest) {
          return <DiceRollWidget key={i} rollRequest={seg.rollRequest} />
        }
        if (seg.type === 'above_table' || isAboveTable) {
          return <AboveTableBubble key={i} content={seg.content} />
        }
        if (seg.type === 'npc' && seg.speaker) {
          return <NPCBubble key={i} speaker={seg.speaker} content={seg.content} />
        }
        return <NarrationBubble key={i} content={seg.content} />
      })}
    </>
  )
}

// Fallback for assistant messages without segments (plain text)
function PlainAssistantMessage({ content }: { content: string }) {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[85%] rounded-2xl bg-zinc-800/80 px-4 py-3">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">{content}</p>
      </div>
    </div>
  )
}

// Render a message based on its role
function ChatMessage({ message }: { message: Message }) {
  if (message.role === 'user') {
    return <UserMessage content={message.content} isAboveTable={message.isAboveTable} />
  }
  
  if (message.role === 'assistant') {
    if (message.segments && message.segments.length > 0) {
      return <AssistantMessage segments={message.segments} isAboveTable={message.isAboveTable} />
    }
    // Fallback for messages without parsed segments
    if (message.isAboveTable) {
      return <AboveTableBubble content={message.content} />
    }
    return <PlainAssistantMessage content={message.content} />
  }
  
  // System messages (if any) - render as narration
  return <NarrationBubble content={message.content} />
}

function LoadingIndicator() {
  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-2 rounded-2xl bg-zinc-800/80 px-4 py-3 text-zinc-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Thinking...</span>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-zinc-300">Welcome, Adventurer</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Type a message to begin your adventure
        </p>
      </div>
    </div>
  )
}

export function ChatArea() {
  const { messages, isLoading, error, sendMessage } = useChatStore()
  const chatInputRef = useRef<ChatInputHandle>(null)

  const handleSend = async (content: string) => {
    await sendMessage(content)
  }

  const handleCommandSelect = (command: string) => {
    chatInputRef.current?.prependText(command)
  }

  return (
    <div className="relative h-full">
      {/* Messages area - scrollable, uses flex-col-reverse to anchor scroll at bottom */}
      <div className="flex h-full flex-col-reverse overflow-y-auto px-4 py-4 pb-36">
        {messages.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <LoadingIndicator />}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute left-4 right-4 top-4 rounded-lg bg-red-900/80 px-4 py-2 text-sm text-red-200">
          Error: {error}
        </div>
      )}

      {/* Bottom input section - floating on top */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-6">
        <div className="mx-auto max-w-[1000px]">
          <SuggestionPills onCommandSelect={handleCommandSelect} />
          <ChatInput ref={chatInputRef} onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  )
}
