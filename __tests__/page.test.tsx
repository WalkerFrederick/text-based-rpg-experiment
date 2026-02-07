import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Home from '@/app/page'

test('renders main layout with sidebars and chat area', () => {
  render(<Home />)
  // Check for campaign section in left sidebar
  expect(screen.getByText('Your Campaigns')).toBeInTheDocument()
  // Check for chat input
  expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
  // Check for right sidebar navigation (character tab)
  expect(screen.getByRole('button', { name: /character/i })).toBeInTheDocument()
})

test('renders suggestion pills', () => {
  render(<Home />)
  expect(screen.getByRole('button', { name: /adventure/i })).toBeInTheDocument()
})
