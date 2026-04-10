import { render, screen } from '@testing-library/react'
import {
  Command, CommandInput, CommandList, CommandItem,
  CommandGroup, CommandEmpty, CommandSeparator,
} from './Command'

describe('Command', () => {
  test('renders command container', () => {
    const { container } = render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
        </CommandList>
      </Command>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  test('renders search input with placeholder', () => {
    render(
      <Command>
        <CommandInput placeholder="Type to search" />
        <CommandList />
      </Command>
    )
    expect(screen.getByPlaceholderText('Type to search')).toBeInTheDocument()
  })

  test('renders group with items', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    expect(screen.getByText('Search Emoji')).toBeInTheDocument()
  })

  test('renders empty state when no results', () => {
    render(
      <Command>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </Command>
    )
    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })

  test('renders separator', () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem>Item 1</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )
    expect(container.querySelector('[cmdk-separator]')).toBeInTheDocument()
  })
})
