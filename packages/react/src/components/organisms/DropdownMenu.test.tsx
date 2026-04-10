import { render, screen } from '@testing-library/react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from './DropdownMenu'

describe('DropdownMenu sub-components', () => {
  test('DropdownMenuLabel renders text', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('My Account')).toBeInTheDocument()
  })

  test('DropdownMenuItem renders text when menu is open', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  test('DropdownMenuSeparator renders when menu is open', () => {
    const { container } = render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    // Radix Separator renders as a div with role="separator" or a decorative hr
    const sep = container.querySelector('[role="separator"]') ??
                document.querySelector('[role="separator"]')
    expect(sep).toBeInTheDocument()
  })

  test('DropdownMenuContent is not in DOM when closed', () => {
    render(
      <DropdownMenu open={false}>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Hidden</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  test('DropdownMenuItem with disabled prop is not interactive', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    const item = screen.getByText('Disabled Item')
    expect(item.closest('[data-disabled]')).toBeInTheDocument()
  })
})
