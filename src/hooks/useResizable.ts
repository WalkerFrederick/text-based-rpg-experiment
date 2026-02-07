'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseResizableOptions {
  minWidth: number
  maxWidth: number
  initialWidth: number
  onWidthChange: (width: number) => void
  direction: 'left' | 'right' // Which side the resize handle is on
}

export function useResizable({
  minWidth,
  maxWidth,
  initialWidth,
  onWidthChange,
  direction,
}: UseResizableOptions) {
  const [isResizing, setIsResizing] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(initialWidth)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsResizing(true)
      startXRef.current = e.clientX
      startWidthRef.current = initialWidth
    },
    [initialWidth]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const delta = e.clientX - startXRef.current
      // For left sidebar, dragging right increases width
      // For right sidebar, dragging left increases width
      const newWidth =
        direction === 'left'
          ? startWidthRef.current + delta
          : startWidthRef.current - delta

      const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth)
      onWidthChange(clampedWidth)
    },
    [isResizing, direction, minWidth, maxWidth, onWidthChange]
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return {
    isResizing,
    handleMouseDown,
  }
}
