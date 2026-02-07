'use client'

import { cn } from '@/lib/utils'

interface AccountCardProps {
  username?: string
  avatarUrl?: string
  onClick?: () => void
}

export function AccountCard({
  username = 'Username',
  avatarUrl,
  onClick,
}: AccountCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg p-3',
        'bg-zinc-800/50 hover:bg-zinc-700/60',
        'transition-colors duration-150'
      )}
    >
      {/* Avatar placeholder */}
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-700">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={username} className="h-full w-full rounded-md object-cover" />
        ) : (
          <span className="text-sm font-medium text-zinc-400">
            {username.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="text-left">
        <p className="text-sm font-medium text-zinc-200">{username}</p>
        <p className="text-xs text-zinc-500">Account Settings</p>
      </div>
    </button>
  )
}
