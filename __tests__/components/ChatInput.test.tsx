import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { ChatInput } from '@/components/chat/ChatInput'

test('renders input field and send button', () => {
  render(<ChatInput />)
  expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
})

test('calls onSend when form is submitted with message', async () => {
  const user = userEvent.setup()
  const onSend = vi.fn()
  render(<ChatInput onSend={onSend} />)

  const input = screen.getByPlaceholderText(/type your message/i)
  await user.type(input, 'Hello world')
  await user.click(screen.getByRole('button', { name: /send message/i }))

  expect(onSend).toHaveBeenCalledWith('Hello world')
})

test('clears input after sending message', async () => {
  const user = userEvent.setup()
  render(<ChatInput onSend={() => {}} />)

  const input = screen.getByPlaceholderText(/type your message/i)
  await user.type(input, 'Test message')
  await user.click(screen.getByRole('button', { name: /send message/i }))

  expect(input).toHaveValue('')
})

test('does not send empty messages', async () => {
  const user = userEvent.setup()
  const onSend = vi.fn()
  render(<ChatInput onSend={onSend} />)

  await user.click(screen.getByRole('button', { name: /send message/i }))

  expect(onSend).not.toHaveBeenCalled()
})

test('send button is disabled when input is empty', () => {
  render(<ChatInput />)
  expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled()
})
