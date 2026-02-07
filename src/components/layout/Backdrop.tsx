'use client'

import { motion } from 'framer-motion'
import { useUIStore } from '@/stores/uiStore'

export function Backdrop() {
  const { activeMobileSidebar, closeMobileSidebar } = useUIStore()

  if (!activeMobileSidebar) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={closeMobileSidebar}
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      aria-hidden="true"
    />
  )
}
