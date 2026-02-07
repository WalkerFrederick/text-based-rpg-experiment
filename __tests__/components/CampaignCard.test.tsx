import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { CampaignCard } from '@/components/sidebar-left/CampaignCard'

const mockCampaign = {
  id: '1',
  title: 'Dragon Quest',
  characterName: 'Aria',
  level: 5,
}

test('renders campaign information', () => {
  render(<CampaignCard campaign={mockCampaign} />)
  expect(screen.getByText('Dragon Quest')).toBeInTheDocument()
  expect(screen.getByText('Aria - Level 5')).toBeInTheDocument()
})

test('calls onClick when card is clicked', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(<CampaignCard campaign={mockCampaign} onClick={onClick} />)

  await user.click(screen.getByText('Dragon Quest'))

  expect(onClick).toHaveBeenCalled()
})

test('calls onSettingsClick when settings button is clicked', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  const onSettingsClick = vi.fn()
  render(
    <CampaignCard
      campaign={mockCampaign}
      onClick={onClick}
      onSettingsClick={onSettingsClick}
    />
  )

  await user.click(screen.getByRole('button', { name: /campaign settings/i }))

  expect(onSettingsClick).toHaveBeenCalled()
  // Should not trigger the card onClick
  expect(onClick).not.toHaveBeenCalled()
})

test('shows active styling when isActive is true', () => {
  const { container } = render(<CampaignCard campaign={mockCampaign} isActive />)
  const card = container.firstChild
  expect(card).toHaveClass('border-indigo-500/50')
})
