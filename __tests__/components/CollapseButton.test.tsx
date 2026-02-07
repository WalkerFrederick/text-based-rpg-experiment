import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { CollapseButton } from '@/components/layout/CollapseButton'

test('renders with expand label when collapsed', () => {
  render(<CollapseButton isCollapsed={true} onClick={() => {}} direction="left" />)
  expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument()
})

test('renders with collapse label when expanded', () => {
  render(<CollapseButton isCollapsed={false} onClick={() => {}} direction="left" />)
  expect(screen.getByRole('button', { name: /collapse sidebar/i })).toBeInTheDocument()
})

test('calls onClick when clicked', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(<CollapseButton isCollapsed={false} onClick={onClick} direction="left" />)

  await user.click(screen.getByRole('button'))

  expect(onClick).toHaveBeenCalled()
})
