import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './Tooltip'

describe('Tooltip', () => {
  test('renders trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  test('content is not visible by default', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  test('renders in open state when open=true', () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Always visible tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    // Radix renders tooltip text twice — once visible, once in a hidden role="tooltip" span.
    // Query by role to find the accessible tooltip element.
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })

  test('shows tooltip content on hover with delayDuration=0', async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    await userEvent.hover(screen.getByText('Hover me'))
    // After hover, the accessible tooltip span should appear
    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
  })

  test('renders with asChild trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Click me</button>
          </TooltipTrigger>
          <TooltipContent>Info</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })
})
