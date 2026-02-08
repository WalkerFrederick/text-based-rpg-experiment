'use client'

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend?: (message: string) => void
  placeholder?: string
  disabled?: boolean
}

export interface ChatInputHandle {
  prependText: (text: string) => void
  focus: () => void
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(function ChatInput(
  {
    onSend,
    placeholder = 'Type your message...',
    disabled = false,
  },
  ref
) {
  const [message, setMessage] = useState('')
  const containerRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    prependText: (text: string) => {
      setMessage((prev) => {
        // If already starts with this command, don't duplicate
        if (prev.startsWith(text.trim())) return prev
        // If there's existing text, prepend with the command
        return text + prev
      })
      // Focus the input after prepending
      inputRef.current?.focus()
    },
    focus: () => {
      inputRef.current?.focus()
    },
  }))

  // Listen for viewport changes and scroll input into view
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const scrollInputIntoView = () => {
      // Only scroll if the input is focused
      if (document.activeElement?.tagName === 'INPUT' && containerRef.current) {
        // Small delay to let the keyboard finish animating
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
        }, 100)
      }
    }

    viewport.addEventListener('resize', scrollInputIntoView)
    return () => viewport.removeEventListener('resize', scrollInputIntoView)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend?.(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFocus = () => {
    // Scroll into view when focused (for mobile keyboard)
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
    }, 300)
  }

  return (
    <form onSubmit={handleSubmit} className="py-4" ref={containerRef}>
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg p-3',
          'bg-zinc-900/80 backdrop-blur-md',
          'border border-zinc-700/50'
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex-1 bg-transparent text-zinc-100',
            'placeholder:text-zinc-500',
            'focus:outline-none',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md',
            'bg-indigo-600 text-white',
            'hover:bg-indigo-500 transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
})
