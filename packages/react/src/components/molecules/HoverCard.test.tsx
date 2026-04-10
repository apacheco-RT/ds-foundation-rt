import { render, screen } from '@testing-library/react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

describe('HoverCard', () => {
  test('renders trigger', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Info</HoverCardContent>
      </HoverCard>
    )
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  test('content is not visible by default', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Info content</HoverCardContent>
      </HoverCard>
    )
    expect(screen.queryByText('Info content')).not.toBeInTheDocument()
  })

  test('renders with custom content structure', () => {
    render(
      <HoverCard>
        <HoverCardTrigger asChild>
          <button>Profile</button>
        </HoverCardTrigger>
        <HoverCardContent>
          <p>User details here</p>
        </HoverCardContent>
      </HoverCard>
    )
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument()
  })
})
