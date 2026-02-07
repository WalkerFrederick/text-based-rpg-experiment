'use client'

import { cn } from '@/lib/utils'
import { SuggestionPills } from './SuggestionPills'
import { ChatInput } from './ChatInput'

interface ChatAreaProps {
  onSendMessage?: (message: string) => void
}

// Mock chat messages for testing scrolling behavior
const mockMessages = [
  { id: '1', role: 'system', content: 'Welcome to the Realm of Shadows. You are a wandering adventurer who has just arrived at the village of Thornhaven. The village sits at the edge of a dark forest, and rumors speak of an ancient evil stirring in the depths.' },
  { id: '2', role: 'user', content: 'I look around the village. What do I see?' },
  { id: '3', role: 'system', content: 'The village of Thornhaven is small but bustling with activity. Wooden buildings line a muddy main street. You see a tavern called "The Rusty Sword" with warm light spilling from its windows, a blacksmith\'s forge billowing smoke, a small temple with a faded holy symbol, and a notice board near the village center. Villagers eye you with a mixture of curiosity and suspicion.' },
  { id: '4', role: 'user', content: 'I approach the notice board and read what\'s posted there.' },
  { id: '5', role: 'system', content: 'The notice board holds several weathered parchments:\n\n• "MISSING: Three children from the Miller family. Last seen near the forest edge. Reward: 50 gold pieces."\n\n• "WANTED: Brave souls to investigate strange lights in the old cemetery. Speak to Father Aldric at the temple."\n\n• "WORK AVAILABLE: The Rusty Sword seeks a strong arm to deal with rowdy patrons. Room and board included."\n\n• "WARNING: Do not venture into Darkwood Forest after nightfall. By order of the Village Elder."' },
  { id: '6', role: 'user', content: 'The missing children sound urgent. I\'ll head to the Miller family to learn more.' },
  { id: '7', role: 'system', content: 'You ask a passing villager for directions to the Miller family home. They point toward a modest farmhouse at the village\'s edge, closest to the forest. As you approach, you see a woman sitting on the porch, her face etched with worry and exhaustion. A man is pacing nearby, occasionally glancing toward the treeline with haunted eyes.' },
  { id: '8', role: 'user', content: 'I approach them carefully and introduce myself. "I saw the notice about your children. I\'d like to help if I can."' },
  { id: '9', role: 'system', content: 'The woman looks up, hope flickering in her tired eyes. "You... you\'d help us? The village guard won\'t go into the forest—they say it\'s too dangerous." The man stops pacing and joins her. "I\'m Thomas Miller. This is my wife, Elena. Our three children—Samuel, Lily, and young Peter—they went to pick berries at the forest edge three days ago. They never came back." His voice breaks. "We found Samuel\'s shoe near an old stone circle deeper in the woods, but... no one will search further."' },
  { id: '10', role: 'user', content: 'I ask about the stone circle. "What can you tell me about this place? And has anything strange happened in the village recently?"' },
  { id: '11', role: 'system', content: 'Thomas and Elena exchange worried glances. "The stone circle... it\'s an old place. Ancient, they say. Most folk avoid it—bad luck, or worse." Elena leans forward. "There have been strange happenings. Livestock going missing. Odd lights in the forest at night. And the dreams..." She shudders. "Many villagers have had nightmares. Whispers of a woman in black, calling to us." Thomas adds grimly, "Old Magda, the herbalist, might know more. She\'s lived here longest and knows the forest\'s secrets. But be warned—she\'s... peculiar."' },
  { id: '12', role: 'user', content: 'Before I head to the forest, I should gather more information. Where can I find Old Magda?' },
  { id: '13', role: 'system', content: '"Magda lives in a cottage at the north end of the village, near the old well," Elena says. "Look for the garden full of strange plants and the crow that sits on her roof. She doesn\'t welcome visitors, but mention our children—she has a soft spot for the little ones. She used to give them sweets when they visited." Thomas presses a worn leather pouch into your hands. "This is all we have—30 gold pieces. Please, bring our children home."' },
  { id: '14', role: 'user', content: 'I accept the responsibility but refuse the payment for now. "Keep your gold. You\'ll need it when your children return." I head to find Old Magda.' },
  { id: '15', role: 'system', content: 'Elena\'s eyes well with tears at your kindness. You make your way through the village toward the north end. Soon enough, you spot Magda\'s cottage—impossible to miss. The garden is a wild tangle of plants you don\'t recognize, some with flowers that seem to glow faintly even in daylight. A large black crow watches you from the roof, tilting its head with unsettling intelligence. The cottage itself is crooked, covered in moss, with smoke curling from a chimney made of mismatched stones. A sign on the door reads: "KNOCK TWICE. WAIT. DO NOT KNOCK AGAIN."' },
  { id: '16', role: 'user', content: 'I follow the instructions exactly. Knock twice, then wait patiently.' },
  { id: '17', role: 'system', content: 'You knock twice. The sound echoes strangely, as if the door is thicker than it appears. You wait. The crow caws once. A minute passes. Then another. Just when you begin to wonder if anyone is home, the door creaks open to reveal a tiny, ancient woman with sharp eyes that seem to look right through you. "Well, well. An adventurer. I wondered when one of your kind would finally show up." She sniffs the air. "You\'ve been to the Miller farm. You smell of their desperation." She steps aside, gesturing you in. "Come. We have much to discuss, and time grows short. The new moon rises tomorrow night."' },
]

function ChatMessage({ role, content }: { role: string; content: string }) {
  const isUser = role === 'user'
  
  return (
    <div className={cn(
      'flex w-full',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'max-w-[85%] rounded-2xl px-4 py-3',
        isUser 
          ? 'bg-indigo-600 text-white' 
          : 'bg-zinc-800/80 text-zinc-100'
      )}>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

export function ChatArea({ onSendMessage }: ChatAreaProps) {
  return (
    <div className="relative h-full">
      {/* Messages area - scrollable, uses flex-col-reverse to anchor scroll at bottom */}
      <div className="flex h-full flex-col-reverse overflow-y-auto px-4 py-4 pb-36">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4">
          {mockMessages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}
        </div>
      </div>

      {/* Bottom input section - floating on top */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-6">
        <div className="mx-auto max-w-[1000px]">
          <SuggestionPills />
          <ChatInput onSend={onSendMessage} />
        </div>
      </div>
    </div>
  )
}
