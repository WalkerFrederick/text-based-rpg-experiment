import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { SuggestionPills } from '@/components/chat/SuggestionPills'

test('renders default suggestion pills', () => {
  render(<SuggestionPills />)
  expect(screen.getByRole('button', { name: /adventure/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /rules/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /suggestions/i })).toBeInTheDocument()
})

test('renders custom suggestions', () => {
  const suggestions = [
    { id: 'custom1', label: 'Attack' },
    { id: 'custom2', label: 'Defend' },
  ]
  render(<SuggestionPills suggestions={suggestions} />)
  expect(screen.getByRole('button', { name: /attack/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /defend/i })).toBeInTheDocument()
})

test('calls onSelect when pill is clicked', async () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()
  render(<SuggestionPills onSelect={onSelect} />)

  await user.click(screen.getByRole('button', { name: /adventure/i }))

  expect(onSelect).toHaveBeenCalledWith({ id: 'adventure', label: 'adventure' })
})
